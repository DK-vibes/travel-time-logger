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
  // All unique YYYY-MM-DD values present in either dataset (Pacific Time)
  const uniqueDates = collectDates(outRows, backRows);

  // Calendar selection state (start with *all* dates selected)
  const [activeDays, setActiveDays] = useState<Set<string>>(
    new Set(uniqueDates),
  );

  const toggleDay = (d: string): void =>
    setActiveDays(prev => {
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

/* helper — collect distinct dates in Pacific time */
function collectDates(a: TravelRow[], b: TravelRow[]): string[] {
  const toKey = (t: string | Date) =>
    new Date(t).toLocaleDateString('en-CA', {
      timeZone: 'America/Los_Angeles',
    });

  return Array.from(
    new Set([...a, ...b].map(r => toKey(r.timestamp))),
  ).sort();
}
