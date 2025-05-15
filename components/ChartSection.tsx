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

interface PointRow {
  minute: number;      // minutes past midnight
  [date: string]: number; // dynamic keys for each YYYY‑MM‑DD
}

function toMinutes(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

export function transform(rows: TravelRow[]): { data: PointRow[]; dates: string[] } {
  const map: Record<number, PointRow> = {};
  const dates: Set<string> = new Set();

  rows.forEach((r) => {
    const pst = new Date(
      new Date(r.timestamp).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
    );
    const minute = toMinutes(pst);
    const dateKey = pst.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }); // YYYY-MM-DD in PT
    dates.add(dateKey);
    if (!map[minute]) map[minute] = { minute };
    map[minute][dateKey] = r.duration_seconds / 60;
  });

  const sortedDates = [...dates].sort(); // older → newer
  return { data: Object.values(map).sort((a, b) => a.minute - b.minute), dates: sortedDates };
}

const hourTicks = Array.from({ length: 25 }, (_, h) => h * 60); // 0,60,…1440

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
            <YAxis domain={[0, 90]} ticks={[0, 30, 60, 90]} />
            <Tooltip
              labelFormatter={(m) => {
                const h = String(Math.floor(Number(m) / 60)).padStart(2, '0');
                const mins = String(Number(m) % 60).padStart(2, '0');
                return `${h}:${mins}`;
              }}
              formatter={(v: number) => (typeof v === 'number' ? v.toFixed(1) : v)}
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
