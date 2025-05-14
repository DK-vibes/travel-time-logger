import { sql } from '@vercel/postgres';

export async function insertTravelTime(seconds: number, meters: number) {
  await sql`INSERT INTO travel_times (duration_seconds, distance_meters) VALUES (${seconds}, ${meters});`;
}

export async function getAllTravelTimes() {
  const { rows } = await sql`SELECT * FROM travel_times ORDER BY timestamp DESC;`;
  return rows;
}