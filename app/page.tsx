import { getOut, getBack, TravelRow } from '@/lib/db';
import ChartSection, { hourTicks, ChartPoint } from '@/components/ChartSection';

export const dynamic = 'force-dynamic';

function buildChartData(rows: TravelRow[]) {
  const times: Record<string, ChartPoint> = {};
  const dateKeys: Set<string> = new Set();

  // pre-seed every hour label so X-axis spans 00:00 → 23:00
  for (const t of hourTicks) {
    times[t] = { t };
  }

  for (const r of rows) {
    const local = new Date(
      new Date(r.timestamp).toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
      })
    );
    const dateKey = local.toISOString().split('T')[0];   // YYYY-MM-DD
    const timeLabel = local.toTimeString().slice(0, 5);  // HH:MM
    dateKeys.add(dateKey);

    times[timeLabel][dateKey] = r.duration_seconds / 60;
  }

  const chartData = Object.values(times).sort((a, b) => a.t.localeCompare(b.t));
  return { chartData, dateKeys: Array.from(dateKeys).sort() };
}

export default async function Page() {
  const [outRows, backRows] = await Promise.all([getOut(), getBack()]);
  const out  = buildChartData(outRows);
  const back = buildChartData(backRows);

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-12">
      <h1 className="text-2xl font-semibold">
        Travel Time by Time of Day&nbsp;<span className="font-normal text-base">(Pacific)</span>
      </h1>

      <ChartSection title="Origin → Destination" {...out} />
      <ChartSection title="Destination → Origin" {...back} />
    </main>
  );
}
