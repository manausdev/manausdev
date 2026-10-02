import { describe, it, expect } from 'vitest';
import { MOCK_DEVS } from '@/domains/developers/mock-data';
import { MOCK_PROJECTS, MOCK_EVENTS } from '@/lib/data/mock';

describe('Ecosystem graph data', () => {
  it('has devs with projects', () => {
    const devIds = new Set(MOCK_DEVS.map(d => d.id));
    const projectAuthors = new Set(MOCK_PROJECTS.map(p => p.author_id));
    expect([...projectAuthors].every(id => id != null && devIds.has(id))).toBe(true);
  });

  it('has events with organizers', () => {
    const devIds = new Set(MOCK_DEVS.map(d => d.id));
    const eventOrganizers = new Set(MOCK_EVENTS.map(e => e.organizer_id));
    expect([...eventOrganizers].every(id => id != null && devIds.has(id))).toBe(true);
  });
});
