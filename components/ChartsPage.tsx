'use client';
import { useState } from 'react';
import ChartSection, { transform } from './ChartSection';
import LegendSection from './LegendSection';
import type { TravelRow } from '@/lib/db';

export default function ChartsPage({
  outRows,
  backRows,
}: {
  outRows: TravelRow[];
  backRows: TravelRow[];
}) {
  // Gather all unique dates from both datasets
  const outTrans = transform(outRows);
  const backTrans = transform(backRows);
  const allDates = Array.from(
    new Set([...outTrans.dates, ...backTrans.dates])
  ).sort();

  // Build a color map (bright blue for most recent, others colorful)
  const colorMap: Record<string, string> = {};
  allDates.forEach((date, idx) => {
    colorMap[date] = idx === allDates.length - 1
      ? '#2680ff'
      : `hsl(${(idx * 55) % 360} 70% 50%)`;
  });

  // State for hidden dates and handler
  const [hiddenDates, setHiddenDates] = useState<Set<string>>(new Set());
  const toggleDate = (date: string) =>
    setHiddenDates((prev) => {
      const next = new Set(prev);
      next.has(date) ? next.delete(date) : next.add(date);
      return next;
    });

  return (
    <main>
      <LegendSection
        dates={allDates}
        hiddenDates={hiddenDates}
        toggleDate={toggleDate}
        colorMap={colorMap}
      />
      <ChartSection
        title="Origin → Destination"
        rows={outRows}
        hiddenDates={hiddenDates}
        colorMap={colorMap}
      />
      <ChartSection
        title="Destination → Origin"
        rows={backRows}
        hiddenDates={hiddenDates}
        colorMap={colorMap}
      />
    </main>
  );
}
