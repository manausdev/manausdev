import type { ProfileUpsert } from './model';
import type { DevelopersRepository } from './repository';

/** Comandos de escrita do domínio `developers` (ADR-0021). */
export function createDevelopersMutations(repo: DevelopersRepository) {
  return {
    upsertProfile(profile: ProfileUpsert): Promise<void> {
      return repo.upsert(profile);
    },
  };
}

export type DevelopersMutations = ReturnType<typeof createDevelopersMutations>;
