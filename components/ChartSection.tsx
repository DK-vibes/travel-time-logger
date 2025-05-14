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

export interface ChartPoint {
  t: string;                 // “HH:MM”
  [date: string]: number | string; // one key per YYYY-MM-DD
}

/** Hour-ticks 00:00 → 23:00 so X-axis always spans full day */
export const hourTicks = Array.from({ length: 24 }, (_, h) =>
  `${String(h).padStart(2, '0')}:00`
);

export default function ChartSection({
  title,
  chartData,
  dateKeys,
}: {
  title: string;
  chartData: ChartPoint[];
  dateKeys: string[];
}) {
  return (
    <section>
      <h2 className="text-xl font-medium mb-3">{title}</h2>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />      {/* vertical guides */}
            <XAxis
              dataKey="t"
              ticks={hourTicks}
              interval={0}
              allowDuplicatedCategory
            />
            <YAxis domain={[0, 90]} tickCount={10} />
            <Tooltip />
            <Legend />
            {dateKeys.map((date, idx) => (
              <Line
                key={date}
                type="monotone"
                dataKey={date}
                strokeWidth={2}
                dot={{ r: 3 }}                 // show dots
                stroke={`hsl(${(idx * 60) % 360} 70% 50%)`}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
