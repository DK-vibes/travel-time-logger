'use client';
import { useState } from 'react';
import Calendar from './Calendar';
import ChartSection from './ChartSection';
import type { TravelRow } from '@/lib/db';

interface ChartsPageProps {
  outRows: TravelRow[];
  backRows: TravelRow[];
}

export default function ChartsPage({ outRows, backRows }: ChartsPageProps) {
  /* Collect every unique date across both datasets */
  const outMeta = transformMeta(outRows);
  const backMeta = transformMeta(backRows);
  const allDates = Array.from(new Set([...outMeta, ...backMeta])).sort();

  /* Build colour map once */
  const colorMap: Record<string, string> = {};
  allDates.forEach((date, idx) => {
    colorMap[date] = idx === allDates.length - 1
      ? '#2680ff'
      : `hsl(${(idx * 55) % 360} 70% 50%)`;
  });
  allDates.forEach((date, idx) => {
    colorMap[date] = idx === allDates.length - 1 ? '#2680ff' : `hsl(${(idx * 55) % 360} 70% 50%)`;
  });

  /* Active day selection */
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set());
  const toggleDay = (d: string) =>
    setActiveDays((prev) => {
      const next = new Set(prev);
      next.has(d) ? next.delete(d) : next.add(d);
      return next;
    });

  return (
    <div className="space-y-10 p-6 max-w-6xl mx-auto">
      <Calendar selected={activeDays} toggle={toggleDay} />
      <ChartSection title="Origin → Destination" rows={outRows} activeDays={activeDays} />
      <ChartSection title="Destination → Origin" rows={backRows} activeDays={activeDays} />
    </div>
  );
}

function transformMeta(rows: TravelRow[]): string[] {
  return Array.from(
    new Set(
      rows.map((r) =>
        new Date(r.timestamp).toLocaleDateString('en-CA', {
          timeZone: 'America/Los_Angeles',
        }),
      ),
    ),
  );
}
