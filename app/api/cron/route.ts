import { NextResponse } from 'next/server';
import { insertOut, insertBack } from '@/lib/db';

export const runtime = 'edge';
export const config = { schedule: '*/10 * * * *' }; // every 10 min

export async function GET() {
  try {
    const origin = process.env.ORIGIN_ADDRESS!;
    const dest   = process.env.DESTINATION_ADDRESS!;
    const key    = process.env.GOOGLE_MAPS_API_KEY!;

    // use one call: origins=A|B, destinations=B|A  → 2×2 matrix
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json` +
      `?origins=${encodeURIComponent(origin)}|${encodeURIComponent(dest)}` +
      `&destinations=${encodeURIComponent(dest)}|${encodeURIComponent(origin)}` +
      `&departure_time=now&key=${key}`;

    const res = await fetch(url);
    const data = await res.json();

    /*
      Matrix layout:
      rows[0].elements[0]  origin→dest  (outbound)
      rows[1].elements[1]  dest→origin  (return)
    */
    const outEl  = data.rows[0].elements[0];
    const backEl = data.rows[1].elements[1];

    await insertOut(
      outEl.duration_in_traffic?.value ?? outEl.duration.value,
      outEl.distance.value,
    );
    await insertBack(
      backEl.duration_in_traffic?.value ?? backEl.duration.value,
      backEl.distance.value,
    );

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ ok: false, error: `${err}` }, { status: 500 });
  }
}