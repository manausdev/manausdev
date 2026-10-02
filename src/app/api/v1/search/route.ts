import { NextResponse } from 'next/server';
import { MOCK_DEVS } from '@/domains/developers/mock-data';
import { MOCK_COMPANIES } from '@/lib/data/mock';
import { MOCK_PROJECTS } from '@/lib/data/mock';
import { MOCK_JOBS } from '@/lib/data/mock';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').toLowerCase();

  if (!q) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
  }

  const people = MOCK_DEVS.filter(
    (d) =>
      d.full_name.toLowerCase().includes(q) ||
      d.username.toLowerCase().includes(q) ||
      (d.role ?? '').toLowerCase().includes(q)
  );

  const companies = MOCK_COMPANIES.filter(
    (c) => c.name.toLowerCase().includes(q) || (c.industry ?? '').toLowerCase().includes(q)
  );

  const projects = MOCK_PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );

  const jobs = MOCK_JOBS.filter(
    (j) =>
      j.title.toLowerCase().includes(q) ||
      (j.company_name ?? '').toLowerCase().includes(q)
  );

  return NextResponse.json({
    data: { people, companies, projects, jobs },
    meta: { query: q, version: 'v1' },
  });
}
