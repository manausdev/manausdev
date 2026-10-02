import type { DevelopersRepository } from './repository';
import { createDevelopersQueries } from './queries';
import { createDevelopersMutations } from './mutations';

/**
 * Fachada do domínio `developers` (ADR-0021): compõe queries + mutations
 * sobre um repositório injetado. Páginas e componentes dependem só daqui —
 * nunca de Supabase ou infraestrutura.
 */
export function createDevelopersService(repo: DevelopersRepository) {
  return {
    ...createDevelopersQueries(repo),
    ...createDevelopersMutations(repo),
  };
}

export type DevelopersService = ReturnType<typeof createDevelopersService>;
