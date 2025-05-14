import { sql } from '@vercel/postgres';

export type TravelRow = {
  id: number;
  timestamp: string; // ISO string in Postgres
  duration_seconds: number;
  distance_meters: number;
};

export async function insertTravelTime(seconds: number, meters: number) {
  await sql`INSERT INTO travel_times (duration_seconds, distance_meters) VALUES (${seconds}, ${meters});`;
}

export async function getAllTravelTimes(): Promise<TravelRow[]> {
  const { rows } = await sql<TravelRow>`SELECT * FROM travel_times ORDER BY timestamp DESC;`;
  return rows;
}