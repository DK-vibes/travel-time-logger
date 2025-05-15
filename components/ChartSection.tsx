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

interface SeriesPoint { minute: number; value: number; }
const hourTicks = Array.from({ length: 25 }, (_, h) => h * 60);

const toMinutes = (d: Date) => d.getHours() * 60 + d.getMinutes();

export default function ChartSection({
  title,
  rows,
  activeDays,
  colorMap,
}: {
  title: string;
  rows: TravelRow[];
  activeDays: Set<string>;
  colorMap: Record<string, string>;
}) {
  // Build a list of series: one per selected day
  const seriesList = Array.from(activeDays).map((day) => {
    const data: SeriesPoint[] = rows
      .filter(
        (r) =>
          new Date(r.timestamp)
            .toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }) === day,
      )
      .map((r) => ({
        minute: toMinutes(new Date(r.timestamp)),
        value: r.duration_seconds / 60,
      }))
      .sort((a, b) => a.minute - b.minute);
    return { day, data };
  });

  return (
    <section>
      <h2 className="text-xl font-medium mb-2">{title}</h2>
      <div className="w-full h-80">
        <ResponsiveContainer>
          <LineChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="minute"
              type="number"
              domain={[0, 1439]}
              ticks={hourTicks}
              tickFormatter={(m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:00`}
            />
            <YAxis domain={[0, 90]} ticks={[0, 30, 60, 90]} />
            <Tooltip formatter={(v) => `${(v as number).toFixed(1)} min`} />
            <Legend />
            {seriesList.map(({ day, data }) => (
              <Line
                key={day}
                data={data}
                dataKey="value"
                name={day}
                stroke={colorMap[day]}
                dot={{ r: 3, fill: colorMap[day] }}
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
