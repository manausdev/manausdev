import type { Profile } from '@/types/database';
import {
  type DevWithStats,
  type DeveloperFacets,
  type DeveloperFilters,
  type ProfileUpsert,
  PAGE_SIZE,
  availabilityParamToDb,
  sanitizeSearchTerm,
} from './model';
import { MOCK_DEVS, getMockDevStats } from './mock-data';

/**
 * Porta de persistência do domínio `developers` (ADR-0021).
 *
 * O domínio só conhece esta interface; as implementações ficam fora:
 * - mock: `MockDevelopersRepository` (abaixo) — usado com NEXT_PUBLIC_USE_MOCK=true;
 * - Supabase: `src/infrastructure/supabase/repositories/developers.ts`.
 */

export interface DevelopersRepository {
  list(filters: DeveloperFilters): Promise<{ devs: DevWithStats[]; total: number }>;
  facets(): Promise<DeveloperFacets>;
  byUsername(username: string): Promise<Profile | null>;
  byId(id: string): Promise<Profile | null>;
  featured(limit: number): Promise<Profile[]>;
  count(): Promise<number>;
  usernames(): Promise<string[]>;
  upsert(profile: ProfileUpsert): Promise<void>;
}

function withStats(dev: Profile): DevWithStats {
  return {
    ...dev,
    projects_count: getMockDevStats(dev.id).projects,
    events_count: getMockDevStats(dev.id).events,
  };
}

/** Implementação em memória — absorve o mock que vivia em `lib/data/mock.ts`. */
export class MockDevelopersRepository implements DevelopersRepository {
  async list(filters: DeveloperFilters): Promise<{ devs: DevWithStats[]; total: number }> {
    const clean = sanitizeSearchTerm(filters.search);
    const availabilityDb = availabilityParamToDb(filters.availability);

    const filtered = MOCK_DEVS.filter((dev) => {
      if (clean) {
        const haystack = `${dev.full_name} ${dev.username} ${dev.role ?? ''} ${dev.bio ?? ''}`.toLowerCase();
        if (!haystack.includes(clean.toLowerCase())) return false;
      }
      if (
        filters.stacks.length > 0 &&
        !filters.stacks.every((s) =>
          (dev.skills ?? []).some((sk) => sk.toLowerCase() === s.toLowerCase())
        )
      ) {
        return false;
      }
      if (filters.city && (dev.city ?? 'Manaus') !== filters.city) return false;
      if (availabilityDb && dev.availability !== availabilityDb) return false;
      if (filters.seniority && dev.seniority !== filters.seniority) return false;
      return true;
    });

    filtered.sort((a, b) => {
      if (filters.sort === 'nome') return (a.full_name ?? '').localeCompare(b.full_name ?? '');
      if (filters.sort === 'antigos') return (a.created_at ?? '').localeCompare(b.created_at ?? '');
      return (b.created_at ?? '').localeCompare(a.created_at ?? '');
    });

    const start = (filters.page - 1) * PAGE_SIZE;
    return {
      devs: filtered.slice(start, start + PAGE_SIZE).map(withStats),
      total: filtered.length,
    };
  }

  async facets(): Promise<DeveloperFacets> {
    const mockSkillCounts = new Map<string, number>();
    for (const dev of MOCK_DEVS) {
      for (const skill of dev.skills ?? []) {
        mockSkillCounts.set(skill, (mockSkillCounts.get(skill) ?? 0) + 1);
      }
    }
    const skills = Array.from(mockSkillCounts.entries())
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count || a.skill.localeCompare(b.skill))
      .slice(0, 12);

    const unique = Array.from(
      new Set(MOCK_DEVS.map((d) => d.city).filter((c): c is string => Boolean(c)))
    ).sort((a, b) => a.localeCompare(b));

    return { skills, cities: unique.length > 0 ? unique : ['Manaus'] };
  }

  async byUsername(username: string): Promise<Profile | null> {
    return (
      MOCK_DEVS.find((d) => d.username.toLowerCase() === username.toLowerCase()) ?? null
    );
  }

  async byId(id: string): Promise<Profile | null> {
    return MOCK_DEVS.find((d) => d.id === id) ?? null;
  }

  async featured(limit: number): Promise<Profile[]> {
    return MOCK_DEVS.slice(0, limit);
  }

  async count(): Promise<number> {
    return MOCK_DEVS.length;
  }

  async usernames(): Promise<string[]> {
    return MOCK_DEVS.map((dev) => dev.username);
  }

  async upsert(profile: ProfileUpsert): Promise<void> {
    const index = MOCK_DEVS.findIndex((d) => d.id === profile.id);
    if (index >= 0) {
      MOCK_DEVS[index] = { ...MOCK_DEVS[index], ...profile };
    }
  }
}

export function createMockDevelopersRepository(): DevelopersRepository {
  return new MockDevelopersRepository();
}
