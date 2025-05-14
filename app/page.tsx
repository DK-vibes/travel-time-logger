import { getAllTravelTimes, TravelRow } from '@/lib/db';
export const revalidate = 60; // refresh once a minute

export default async function Page() {
  const rows = await getAllTravelTimes();
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Travel Time Log</h1>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="border p-2">Timestamp</th>
            <th className="border p-2">Duration (min)</th>
            <th className="border p-2">Distance (mi)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: TravelRow) => (
            <tr key={r.id} className="odd:bg-gray-50 dark:odd:bg-gray-800">
              <td className="border p-2">{new Date(r.timestamp).toLocaleString()}</td>
              <td className="border p-2 text-right">{(r.duration_seconds / 60).toFixed(1)}</td>
              <td className="border p-2 text-right">{(r.distance_meters / 1609.34).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}