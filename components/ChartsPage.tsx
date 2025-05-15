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
  // Determine which days have any data (Pacific time)
  const allDays = getUniqueDays(outRows, backRows);

  // State: which days are currently selected (start with none)
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set());

  const toggleDay = (day: string): void => {
    setActiveDays((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  };

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

function getUniqueDays(a: TravelRow[], b: TravelRow[]): string[] {
  const toKey = (t: string | Date): string =>
    new Date(t).toLocaleDateString('en-CA', {
      timeZone: 'America/Los_Angeles',
    });

  return Array.from(
    new Set([
      ...a.map((r) => toKey(r.timestamp)),
      ...b.map((r) => toKey(r.timestamp)),
    ]),
  ).sort();
}
