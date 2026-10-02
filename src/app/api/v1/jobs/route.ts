import { NextResponse } from 'next/server';
import { MOCK_JOBS } from '@/lib/data/mock';

export async function GET() {
  return NextResponse.json({
    data: MOCK_JOBS,
    meta: { total: MOCK_JOBS.length, version: 'v1' },
  });
}
