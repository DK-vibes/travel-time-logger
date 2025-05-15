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
import { useState } from 'react';
import type { TravelRow } from '@/lib/db';

interface PointRow {
  minute: number;
  [date: string]: number;
}

const hourTicks = Array.from({ length: 25 }, (_, h) => h * 60); // 0‑1440

/* ---------- helpers ---------- */
function toMinutes(d: Date) {
  return d.getHours() * 60 + d.getMinutes();
}

function transform(rows: TravelRow[]) {
  const map: Record<number, PointRow> = {};
  const dates = new Set<string>();

  for (const r of rows) {
    const pst = new Date(
      new Date(r.timestamp).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
    );
    const minute  = toMinutes(pst);
    const dateKey = pst.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
    dates.add(dateKey);
    if (!map[minute]) map[minute] = { minute };
    map[minute][dateKey] = r.duration_seconds / 60;
  }

  return {
    data: Object.values(map).sort((a, b) => a.minute - b.minute),
    dates: [...dates].sort(), // oldest → newest
  };
}

/* ---------- component ---------- */
export default function ChartSection({ title, rows }: { title: string; rows: TravelRow[] }) {
  const { data, dates } = transform(rows);
  const newest = dates[dates.length - 1];
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const toggle = (d: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(d) ? next.delete(d) : next.add(d);
      return next;
    });

  // clickable legend renderer (typed as any to satisfy Recharts TS mismatch)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLegend = (props: any) => {
    const { payload } = props;
    if (!payload) return null;
    return (
      <ul className="flex flex-wrap gap-4 text-sm">
        {payload.map(({ value, color }: any) => {
          const key = String(value);
          const active = !hidden.has(key);
          return (
            <li
              key={key}
              style={{ cursor: 'pointer', opacity: active ? 1 : 0.3 }}
              onClick={() => toggle(key)}
            >
              <svg width={12} height={12} style={{ marginRight: 4 }}>
                <rect width={12} height={12} fill={String(color)} />
              </svg>
              {key}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-medium">{title}</h2>
      <div className="w-full h-80">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="minute"
              type="number"
              domain={[0, 1439]}
              ticks={hourTicks}
              tickFormatter={(m) => `${String(Math.floor(Number(m) / 60)).padStart(2, '0')}:00`}
            />
            <YAxis domain={[0, 90]} ticks={[0, 30, 60, 90]} />
            <Tooltip
              labelFormatter={(m) => {
                const h = String(Math.floor(Number(m) / 60)).padStart(2, '0');
                const mins = String(Number(m) % 60).padStart(2, '0');
                return `${h}:${mins}`;
              }}
              formatter={(v) => (typeof v === 'number' ? v.toFixed(1) : v)}
            />
            {/* cast as any to avoid Recharts TS incompat */}
            <Legend content={renderLegend as any} />

            {dates.map((date, idx) => {
              if (hidden.has(date)) return null;
              const stroke = date === newest ? '#2680ff' : `hsl(${(idx * 55) % 360} 70% 50%)`;
              return (
                <Line
                  key={date}
                  dataKey={date}
                  type="monotone"
                  stroke={stroke}
                  dot={{ r: 3, stroke, fill: stroke }}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
