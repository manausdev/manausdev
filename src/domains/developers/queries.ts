import type { Profile } from '@/types/database';
import type { DevWithStats, DeveloperFacets } from './model';
import type { DevelopersRepository } from './repository';

/** Consultas de leitura do domínio `developers` (ADR-0021). */
export function createDevelopersQueries(repo: DevelopersRepository) {
  return {
    list(filters: Parameters<DevelopersRepository['list']>[0]) {
      return repo.list(filters);
    },
    facets(): Promise<DeveloperFacets> {
      return repo.facets();
    },
    byUsername(username: string): Promise<Profile | null> {
      return repo.byUsername(username);
    },
    byId(id: string): Promise<Profile | null> {
      return repo.byId(id);
    },
    featured(limit: number): Promise<Profile[]> {
      return repo.featured(limit);
    },
    count(): Promise<number> {
      return repo.count();
    },
    usernames(): Promise<string[]> {
      return repo.usernames();
    },
  };
}

export type DevelopersQueries = ReturnType<typeof createDevelopersQueries>;
export type { DevWithStats };
