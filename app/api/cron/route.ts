import { NextResponse } from 'next/server';
import { insertTravelTime } from '@/lib/db';

export const runtime = 'edge';
export const config = { schedule: '*/10 * * * *' }; // every 10 min

export async function GET() {
  try {
    const origin = process.env.ORIGIN_ADDRESS!;
    const dest   = process.env.DESTINATION_ADDRESS!;
    const key    = process.env.GOOGLE_MAPS_API_KEY!;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(dest)}&departure_time=now&key=${key}`;
    const res = await fetch(url);
    const data = await res.json();

    const el = data.rows[0].elements[0];
    const seconds = el.duration_in_traffic?.value ?? el.duration.value;
    const meters  = el.distance.value;

    await insertTravelTime(seconds, meters);
    return NextResponse.json({ ok: true, seconds, meters });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ ok: false, error: `${err}` }, { status: 500 });
  }
}