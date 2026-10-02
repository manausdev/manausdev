import type { TaxonomyRepository } from './repository';
import type { TaxonomyCategory, TaxonomyItem } from './model';

export function createTaxonomyService(repo: TaxonomyRepository) {
  return {
    listByCategory: (category: TaxonomyCategory) => repo.listByCategory(category),
    getBySlug: (slug: string) => repo.getBySlug(slug),
    listAll: () => repo.listAll(),
    search: (query: string) => repo.search(query),
  };
}

export type TaxonomyService = ReturnType<typeof createTaxonomyService>;
