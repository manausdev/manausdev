import { NextResponse } from 'next/server';
import { MOCK_DEVS } from '@/domains/developers/mock-data';

export async function GET() {
  return NextResponse.json({
    data: MOCK_DEVS,
    meta: { total: MOCK_DEVS.length, version: 'v1' },
  });
}
