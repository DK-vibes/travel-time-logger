'use client';
import { useState } from 'react';
import Calendar from './Calendar';
import ChartSection from './ChartSection';
import type { TravelRow } from '@/lib/db';

export default function ChartsPage({ outRows, backRows }: { outRows: TravelRow[]; backRows: TravelRow[] }) {
  const [activeDays, setActiveDays] = useState<Set<string>>(new Set());
  const toggleDay = (d: string) => setActiveDays((prev) => {
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