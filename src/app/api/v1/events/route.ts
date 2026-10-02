import { NextResponse } from 'next/server';
import { MOCK_EVENTS } from '@/lib/data/mock';

export async function GET() {
  return NextResponse.json({
    data: MOCK_EVENTS,
    meta: { total: MOCK_EVENTS.length, version: 'v1' },
  });
}
