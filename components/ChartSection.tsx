'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TravelRow } from '@/lib/db';

/* Helper: flatten DB rows into { minute, dateKey, value } */
function transform(rows: TravelRow[]) {
  const byDate: Record<string, { minute: number; value: number }[]> = {};
  rows.forEach((r) => {
    const d = new Date(r.timestamp);
    const pst = new Date(d.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const minute = pst.getHours() * 60 + pst.getMinutes();
    const dateKey = pst.toISOString().split('T')[0];
    if (!byDate[dateKey]) byDate[dateKey] = [];
    byDate[dateKey].push({ minute, value: r.duration_seconds / 60 });
  });

  // merge into recharts-friendly objects: { minute, 2025-05-14: 23.4, … }
  const map: Record<number, ChartPoint> = {};
  Object.entries(byDate).forEach(([date, arr]) => {
    arr.forEach(({ minute, value }) => {
      if (!map[minute]) map[minute] = { minute } as ChartPoint;
      map[minute][date] = value;
    });
  });
  return { data: Object.values(map).sort((a, b) => a.minute - b.minute), dates: Object.keys(byDate) };
}

const hourTicks = Array.from({ length: 25 }, (_, h) => h * 60); // 0–1440 step 60

export default function ChartSection({ title, rows }: { title: string; rows: TravelRow[] }) {
  const { data, dates } = transform(rows);
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-medium">{title}</h2>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="minute"
              type="number"
              domain={[0, 1439]}
              ticks={hourTicks}
              tickFormatter={(m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:00`}
            />
            <YAxis domain={[0, 90]} />
            <Tooltip
              labelFormatter={(m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`}
            />
            <Legend />
            {dates.map((date, idx) => (
              <Line
                key={date}
                dataKey={date}
                type="monotone"
                dot={{ r: 3 }}
                stroke={`hsl(${(idx * 55) % 360} 70% 50%)`}
                strokeWidth={2}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}