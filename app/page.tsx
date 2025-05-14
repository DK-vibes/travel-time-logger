import { getOut, getBack, TravelRow } from '@/lib/db';
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

export const dynamic = 'force-dynamic';

// Convert DB rows → chart data object
function buildChartData(rows: TravelRow[]) {
  const times: Record<string, Record<string, number>> = {}; // timeLabel → { date: minutes }
  const dateKeys: Set<string> = new Set();

  for (const r of rows) {
    const local = new Date(
      new Date(r.timestamp).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
    );
    const dateKey = local.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeLabel = local.toTimeString().slice(0, 5); // HH:MM
    dateKeys.add(dateKey);

    if (!times[timeLabel]) times[timeLabel] = { t: timeLabel } as any;
    (times[timeLabel] as any)[dateKey] = r.duration_seconds / 60;
  }

  // Sort by timeLabel ascending (00:00 → 23:59)
  const chartData = Object.values(times).sort((a, b) => (a as any).t.localeCompare((b as any).t));

  return { chartData, dateKeys: Array.from(dateKeys).sort() };
}

export default async function Page() {
  const [outRows, backRows] = await Promise.all([getOut(), getBack()]);
  const out = buildChartData(outRows);
  const back = buildChartData(backRows);

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-12">
      <h1 className="text-2xl font-semibold">Travel Time by Time of Day (Pacific)</h1>
      <ChartSection title="Origin → Destination" {...out} />
      <ChartSection title="Destination → Origin" {...back} />
    </main>
  );
}

function ChartSection({
  title,
  chartData,
  dateKeys,
}: {
  title: string;
  chartData: Record<string, any>[];
  dateKeys: string[];
}) {
  return (
    <section>
      <h2 className="text-xl font-medium mb-3">{title}</h2>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" interval={5} minTickGap={15} />
            <YAxis domain={[0, 90]} tickCount={10} />
            <Tooltip />
            <Legend />
            {dateKeys.map((date, idx) => (
              <Line
                key={date}
                type="monotone"
                dataKey={date}
                strokeWidth={2}
                dot={false}
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