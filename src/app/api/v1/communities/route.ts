import { NextResponse } from 'next/server';
import { MOCK_COMMUNITIES } from '@/lib/data/mock';

export async function GET() {
  return NextResponse.json({
    data: MOCK_COMMUNITIES,
    meta: { total: MOCK_COMMUNITIES.length, version: 'v1' },
  });
}
