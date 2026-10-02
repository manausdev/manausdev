/**
 * Domínio `taxonomy`: vocabulário controlado compartilhado da plataforma.
 * Cada item possui slug + name + category, servido via repository.
 */

export type TaxonomyCategory =
  | 'skills'
  | 'technologies'
  | 'industries'
  | 'job_types'
  | 'event_types'
  | 'community_types'
  | 'project_types'
  | 'roles'
  | 'cities';

export interface TaxonomyItem {
  slug: string;
  name: string;
  category: TaxonomyCategory;
  description?: string | null;
}

/** Normaliza slug: minúsculas, hífens, sem acentos. */
export function normalizeSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Cria item de taxonomy a partir de nome e categoria. */
export function createTaxonomyItem(
  name: string,
  category: TaxonomyCategory,
  description?: string | null
): TaxonomyItem {
  return {
    slug: normalizeSlug(name),
    name,
    category,
    description: description ?? null,
  };
}
