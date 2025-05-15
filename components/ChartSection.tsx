'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { TravelRow } from '@/lib/db';

interface PointRow { minute: number; value: number; }
const hourTicks = Array.from({ length: 25 }, (_, h) => h * 60);

const toMinutes = (d: Date) => d.getHours() * 60 + d.getMinutes();

export function buildSeries(rows: TravelRow[], days: Set<string>): PointRow[] {
  return rows
    .filter((r) => days.has(new Date(r.timestamp).toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })))
    .map((r) => ({ minute: toMinutes(new Date(r.timestamp)), value: r.duration_seconds / 60 }))
    .sort((a, b) => a.minute - b.minute);
}

export default function ChartSection({ title, rows, activeDays }: {
  title: string; rows: TravelRow[]; activeDays: Set<string>;
}) {
  const data = buildSeries(rows, activeDays);

  return (
    <section>
      <h2 className="text-xl font-medium mb-2">{title}</h2>
      <div className="w-full h-80">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="minute"
              type="number"
              domain={[0, 1439]}
              ticks={hourTicks}
              tickFormatter={(m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:00`}
            />
            <YAxis domain={[0, 90]} ticks={[0, 30, 60, 90]} />
            <Tooltip formatter={(v) => `${(v as number).toFixed(1)} min`} />
            <Line dataKey="value" type="monotone" stroke="#2680ff" dot={{ r: 3 }} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}