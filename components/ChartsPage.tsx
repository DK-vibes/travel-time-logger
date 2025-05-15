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
  // Collect every unique YYYY‑MM‑DD across both datasets (Pacific time)
  const uniqueDates = collectDates(outRows, backRows);

  // User‑selected days (toggle on calendar)
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set(uniqueDates)); // pre‑select all days
  const toggleDay = (d: string) =>
    setActiveDays((prev) => {
      const next = new Set(prev);
      next.has(d) ? next.delete(d) : next.add(d);
      return next;
    });

  return (
    <div className="space-y-10 p-6 max-w-6xl mx-auto">
      <Calendar selected={activeDays} toggle={toggleDay} />

      <ChartSection
        title="Origin → Destination"
        rows={outRows}
        activeDays={activeDays}
      />

      <ChartSection
        title="Destination → Origin"
        rows={backRows}
        activeDays={activeDays}
      />
    </div>
  );
}

function collectDates(outRows: TravelRow[], backRows: TravelRow[]): string[] {
  const fmt = (t: string | Date) =>
    new Date(t).toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });

  return Array.from(
    new Set([
      ...outRows.map((r) => fmt(r.timestamp)),
      ...backRows.map((r) => fmt(r.timestamp)),
    ]),
  ).sort();
}
