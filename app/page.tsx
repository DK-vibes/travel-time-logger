import { getOut, getBack } from '@/lib/db';
import ChartSection from '@/components/ChartSection';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [outRows, backRows] = await Promise.all([getOut(), getBack()]);
  return (
    <main className="p-6 max-w-5xl mx-auto space-y-12">
      <h1 className="text-2xl font-semibold">Travel Time by Time of Day (Pacific)</h1>
      <ChartSection title="Origin → Destination" rows={outRows} />
      <ChartSection title="Destination → Origin" rows={backRows} />
    </main>
  );
}