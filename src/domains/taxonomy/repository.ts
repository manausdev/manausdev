import type { TaxonomyItem, TaxonomyCategory } from './model';
import { getItemsByCategory, getItemBySlug, TAXONOMY_ITEMS } from './mock-data';

/**
 * Porta de persistência do domínio `taxonomy`.
 * Implementações: MockTaxonomyRepository (mock) e Supabase (infra).
 */
export interface TaxonomyRepository {
  listByCategory(category: TaxonomyCategory): Promise<TaxonomyItem[]>;
  getBySlug(slug: string): Promise<TaxonomyItem | null>;
  listAll(): Promise<TaxonomyItem[]>;
  search(query: string): Promise<TaxonomyItem[]>;
}

export class MockTaxonomyRepository implements TaxonomyRepository {
  async listByCategory(category: TaxonomyCategory): Promise<TaxonomyItem[]> {
    return getItemsByCategory(category);
  }

  async getBySlug(slug: string): Promise<TaxonomyItem | null> {
    return getItemBySlug(slug);
  }

  async listAll(): Promise<TaxonomyItem[]> {
    return TAXONOMY_ITEMS;
  }

  async search(query: string): Promise<TaxonomyItem[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return TAXONOMY_ITEMS.filter(
      (i) => i.name.toLowerCase().includes(q) || i.slug.includes(q)
    );
  }
}

export function createMockTaxonomyRepository(): TaxonomyRepository {
  return new MockTaxonomyRepository();
}
