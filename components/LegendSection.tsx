'use client';
import React from 'react';

interface LegendSectionProps {
  dates: string[];
  hiddenDates: Set<string>;
  toggleDate: (date: string) => void;
  colorMap: Record<string, string>;
}

export default function LegendSection({
  dates,
  hiddenDates,
  toggleDate,
  colorMap,
}: LegendSectionProps) {
  // Show most recent first
  const legendDates = [...dates].reverse();
  return (
    <ul className="flex flex-wrap gap-4 text-sm mb-2">
      {legendDates.map((date) => {
        const active = !hiddenDates.has(date);
        const stroke = colorMap[date] || '#ccc';
        return (
          <li
            key={date}
            style={{ cursor: 'pointer', opacity: active ? 1 : 0.3 }}
            onClick={() => toggleDate(date)}
          >
            <svg width={12} height={12} style={{ marginRight: 4 }}>
              <rect width={12} height={12} fill={stroke} />
            </svg>
            {date}
          </li>
        );
      })}
    </ul>
  );
}
