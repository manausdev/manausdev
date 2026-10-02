import { NextResponse } from 'next/server';
import { MOCK_COMPANIES } from '@/lib/data/mock';

export async function GET() {
  return NextResponse.json({
    data: MOCK_COMPANIES,
    meta: { total: MOCK_COMPANIES.length, version: 'v1' },
  });
}
