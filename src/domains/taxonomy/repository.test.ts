import { describe, it, expect } from 'vitest';
import { createMockTaxonomyRepository } from './repository';
import { normalizeSlug, createTaxonomyItem } from './model';

describe('Taxonomy domain', () => {
  it('normalizes slug correctly', () => {
    expect(normalizeSlug('ReactJS')).toBe('reactjs');
    expect(normalizeSlug('Node.js')).toBe('node-js');
    expect(normalizeSlug('São Paulo')).toBe('sao-paulo');
  });

  it('creates taxonomy item with slug', () => {
    const item = createTaxonomyItem('React', 'skills');
    expect(item.slug).toBe('react');
    expect(item.name).toBe('React');
    expect(item.category).toBe('skills');
  });

  it('repository lists by category', async () => {
    const repo = createMockTaxonomyRepository();
    const skills = await repo.listByCategory('skills');
    expect(skills.length).toBeGreaterThan(0);
    expect(skills.every(s => s.category === 'skills')).toBe(true);
  });

  it('repository gets by slug', async () => {
    const repo = createMockTaxonomyRepository();
    const item = await repo.getBySlug('react');
    expect(item).not.toBeNull();
    expect(item?.name).toBe('React');
  });

  it('repository search works', async () => {
    const repo = createMockTaxonomyRepository();
    const results = await repo.search('react');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.name.toLowerCase().includes('react'))).toBe(true);
  });
});
