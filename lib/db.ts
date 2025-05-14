import { sql } from '@vercel/postgres';

export type TravelRow = {
  id: number;
  timestamp: string;
  duration_seconds: number;
  distance_meters: number;
};

// --- insert helpers ---
export async function insertOut(seconds: number, meters: number) {
  await sql`INSERT INTO travel_times (duration_seconds, distance_meters) VALUES (${seconds}, ${meters});`;
}

export async function insertBack(seconds: number, meters: number) {
  await sql`INSERT INTO travel_times_back (duration_seconds, distance_meters) VALUES (${seconds}, ${meters});`;
}

// --- query helpers ---
export async function getOut(): Promise<TravelRow[]> {
  const { rows } = await sql<TravelRow>`SELECT * FROM travel_times ORDER BY timestamp DESC;`;
  return rows;
}

export async function getBack(): Promise<TravelRow[]> {
  const { rows } = await sql<TravelRow>`SELECT * FROM travel_times_back ORDER BY timestamp DESC;`;
  return rows;
}