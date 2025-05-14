import { getOut, getBack, TravelRow } from '@/lib/db';
import nextDynamic from 'next/dynamic';

// Dynamically import the client‑only chart component (no SSR)
const ChartSection = nextDynamic(() => import('@/components/ChartSection'), { ssr: false });

export const dynamic = 'force-dynamic';

interface ChartPoint {
  t: string;
  [date: string]: number | string;
}

function buildChartData(rows: TravelRow[]) {
  const times: Record<string, ChartPoint> = {};
  const dateKeys: Set<string> = new Set();

  for (const r of rows) {
    const local = new Date(
      new Date(r.timestamp).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
    );
    const dateKey = local.toISOString().split('T')[0];
    const timeLabel = local.toTimeString().slice(0, 5);
    dateKeys.add(dateKey);

    if (!times[timeLabel]) times[timeLabel] = { t: timeLabel };
    times[timeLabel][dateKey] = r.duration_seconds / 60;
  }
  const chartData = Object.values(times).sort((a, b) => a.t.localeCompare(b.t));
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