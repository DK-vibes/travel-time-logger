import { getOut, getBack } from '@/lib/db';
import ChartSection from '@/components/ChartSection';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [outRows, backRows] = await Promise.all([getOut(), getBack()]);
  return (
    <main className="p-6 max-w-5xl mx-auto space-y-12">
      <h1 className="text-2xl font-semibold">Commute time vs. Departure time</h1>
      <ChartSection title="Home → Work" rows={outRows} />
      <ChartSection title="Work → Home" rows={backRows} />
    </main>
  );
}