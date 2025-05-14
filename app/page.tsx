import { getOut, getBack, TravelRow } from '@/lib/db';
import { hourTicks } from '@/lib/hourTicks';
import ChartSection from '@/components/ChartSection';
import type { ChartPoint } from '@/components/ChartSection';

export const dynamic = 'force-dynamic';

/* convert DB rows → array of ChartPoint for Recharts */
function buildChartData(rows: TravelRow[]) {
  const times: Record<string, ChartPoint> = {};
  const dateKeys: Set<string> = new Set();

  /* seed every hour label so the axis always spans the full day */
  for (const t of hourTicks) times[t] = { t };

  for (const r of rows) {
    const local = new Date(
      new Date(r.timestamp).toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
      }),
    );
    const dateKey   = local.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeLabel = local.toTimeString().slice(0, 5);  // HH:MM
    dateKeys.add(dateKey);

    times[timeLabel][dateKey] = r.duration_seconds / 60;
  }

  const chartData = Object.values(times).sort((a, b) => a.t.localeCompare(b.t));
  return { chartData, dateKeys: [...dateKeys].sort() };
}

export default async function Page() {
  const [outRows, backRows] = await Promise.all([getOut(), getBack()]);
  const out  = buildChartData(outRows);
  const back = buildChartData(backRows);

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-12">
      <h1 className="text-2xl font-semibold">
        Travel Time by Time of Day&nbsp;
        <span className="font-normal text-base">(Pacific)</span>
      </h1>

      <ChartSection title="Origin → Destination" {...out} />
      <ChartSection title="Destination → Origin" {...back} />
    </main>
  );
}
