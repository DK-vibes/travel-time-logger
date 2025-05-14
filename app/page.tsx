import { getOut, getBack, TravelRow } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function Page() {
  const [outRows, backRows] = await Promise.all([getOut(), getBack()]);

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-10">
      <h1 className="text-2xl font-semibold">Travel Time Log</h1>

      <section>
        <h2 className="text-xl font-medium mb-2">Origin → Destination</h2>
        <Table rows={outRows} />
      </section>

      <section>
        <h2 className="text-xl font-medium mb-2">Destination → Origin</h2>
        <Table rows={backRows} />
      </section>
    </main>
  );
}

function Table({ rows }: { rows: TravelRow[] }) {
  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-200 dark:bg-gray-700">
          <th className="border p-2">Timestamp (PT)</th>
          <th className="border p-2">Duration (min)</th>
          <th className="border p-2">Distance (mi)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id} className="odd:bg-gray-50 dark:odd:bg-gray-800">
            <td className="border p-2">
              {new Date(r.timestamp).toLocaleString('en-US', {
                timeZone: 'America/Los_Angeles',
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </td>
            <td className="border p-2 text-right">{(r.duration_seconds / 60).toFixed(1)}</td>
            <td className="border p-2 text-right">{(r.distance_meters / 1609.34).toFixed(1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}