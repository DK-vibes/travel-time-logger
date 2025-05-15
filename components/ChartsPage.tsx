'use client';
import { useState } from 'react';
import ChartSection, { transform } from './ChartSection';
import LegendSection from './LegendSection';
import type { TravelRow } from '@/lib/db';

interface ChartsPageProps {
  outRows: TravelRow[];
  backRows: TravelRow[];
}

export default function ChartsPage({ outRows, backRows }: ChartsPageProps) {
  /* 1. Collect every distinct YYYY‑MM‑DD across both datasets */
  const outMeta = transform(outRows);
  const backMeta = transform(backRows);
  const allDates = Array.from(
    new Set([...outMeta.dates, ...backMeta.dates])
  ).sort();

  /* 2. Build a deterministic colour map */
  const colorMap: Record<string, string> = {};
  allDates.forEach((date, idx) => {
    colorMap[date] = idx === allDates.length - 1
      ? '#2680ff' // newest = bright blue
      : `hsl(${(idx * 55) % 360} 70% 50%)`;
  });

  /* 3. Track which dates are hidden (shared state) */
  const [hiddenDates, setHiddenDates] = useState<Set<string>>(new Set());
  const toggleDate = (date: string) =>
    setHiddenDates((prev) => {
      const next = new Set(prev);
      next.has(date) ? next.delete(date) : next.add(date);
      return next;
    });

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-8">
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