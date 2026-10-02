import { NextResponse } from 'next/server';
import { MOCK_PROJECTS } from '@/lib/data/mock';

export async function GET() {
  return NextResponse.json({
    data: MOCK_PROJECTS,
    meta: { total: MOCK_PROJECTS.length, version: 'v1' },
  });
}
