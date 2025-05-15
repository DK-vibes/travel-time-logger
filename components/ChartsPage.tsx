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
  // Gather unique days from both datasets
  const uniqueDays = Array.from(
    new Set([
      ...outRows.map((r) =>
        new Date(r.timestamp).toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }),
      ),
      ...backRows.map((r) =>
        new Date(r.timestamp).toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }),
      ),
    ]),
  ).sort();

  // Build a color map: distinct HSL colors per day
  const colorMap: Record<string, string> = {};
  uniqueDays.forEach((day, idx) => {
    const hue = (idx * 360) / uniqueDays.length;
    colorMap[day] = `hsl(${hue} 70% 50%)`;
  });

  // State of selected days
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
      <Calendar selected={activeDays} toggle={toggleDay} colorMap={colorMap} />

      <ChartSection
        title="Origin → Destination"
        rows={outRows}
        activeDays={activeDays}
        colorMap={colorMap}
      />
      <ChartSection
        title="Destination → Origin"
        rows={backRows}
        activeDays={activeDays}
        colorMap={colorMap}
      />
    </div>
  );
}
