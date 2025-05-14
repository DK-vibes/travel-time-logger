import { getOut, getBack, TravelRow } from '@/lib/db';
import ChartSection from '@/components/ChartSection';

export const dynamic = 'force-dynamic';

interface ChartPoint {
  t: string;              // HH:MM label
  [date: string]: number | string; // one key per YYYY-MM-DD
}

function buildChartData(rows: TravelRow[]) {
  const times: Record<string, ChartPoint> = {};
  const dateKeys: Set<string> = new Set();

  // ensure every hour label exists so X-axis spans full day
  for (const t of hourTicks) {
    times[t] = { t } as ChartPoint;
  }

  for (const r of rows) {
    const local = new Date(
      new Date(r.timestamp).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
    );
    const dateKey = local.toISOString().split('T')[0];
    const timeLabel = local.toTimeString().slice(0, 5);
    dateKeys.add(dateKey);

    times[timeLabel][dateKey] = r.duration_seconds / 60;
  }

  const chartData = Object.values(times).sort((a, b) => a.t.localeCompare(b.t));
  return { chartData, dateKeys: Array.from(dateKeys).sort() };
}
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