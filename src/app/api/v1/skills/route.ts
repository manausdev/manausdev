import { NextResponse } from 'next/server';
import { MOCK_DEVS } from '@/domains/developers/mock-data';

export async function GET() {
  const skillCounts = new Map<string, number>();
  for (const dev of MOCK_DEVS) {
    for (const skill of dev.skills ?? []) {
      skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1);
    }
  }
  const skills = Array.from(skillCounts.entries())
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({
    data: skills,
    meta: { total: skills.length, version: 'v1' },
  });
}
