import { getOut, getBack } from '@/lib/db';

export const dynamic = 'force-dynamic'; // always render fresh

export default async function Page() {
  const [outRows, backRows] = await Promise.all([getOut(), getBack()]);

  const renderTable = (rows: Awaited<ReturnType<typeof getOut>>) => (
    <table className="min-w-full border border-gray-300 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-2 py-1 border">Timestamp (PT)</th>
          <th className="px-2 py-1 border text-right">Minutes</th>
          <th className="px-2 py-1 border text-right">Distance (km)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const local = new Date(r.timestamp).toLocaleString('en-US', {
            timeZone: 'America/Los_Angeles',
          });
          return (
            <tr key={r.id} className="even:bg-gray-50">
              <td className="px-2 py-1 border whitespace-nowrap">{local}</td>
              <td className="px-2 py-1 border text-right">{(r.duration_seconds / 60).toFixed(1)}</td>
              <td className="px-2 py-1 border text-right">{(r.distance_meters / 1000).toFixed(1)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <main className="p-6 space-y-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold">Travel‑Time Logger</h1>

      <section>
        <h2 className="text-xl font-medium mb-2">Origin → Destination</h2>
        {renderTable(outRows)}
      </section>

      <section>
        <h2 className="text-xl font-medium mb-2">Destination → Origin</h2>
        {renderTable(backRows)}
      </section>
    </main>
  );
}