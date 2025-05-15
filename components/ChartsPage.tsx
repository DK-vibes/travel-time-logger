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
  // Track which days are selected (in 'YYYY-MM-DD' PT format)
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set());

  const toggleDay = (day: string): void => {
    setActiveDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
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