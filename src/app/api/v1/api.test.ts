import { describe, it, expect } from 'vitest';
import { MOCK_DEVS } from '@/domains/developers/mock-data';
import { MOCK_COMPANIES } from '@/lib/data/mock';
import { MOCK_PROJECTS } from '@/lib/data/mock';
import { MOCK_JOBS } from '@/lib/data/mock';
import { MOCK_EVENTS } from '@/lib/data/mock';
import { MOCK_COMMUNITIES } from '@/lib/data/mock';

describe('API v1 data', () => {
  it('people returns mock devs', () => {
    expect(MOCK_DEVS.length).toBeGreaterThan(0);
  });

  it('companies returns mock companies', () => {
    expect(MOCK_COMPANIES.length).toBeGreaterThan(0);
  });

  it('projects returns mock projects', () => {
    expect(MOCK_PROJECTS.length).toBeGreaterThan(0);
  });

  it('jobs returns mock jobs', () => {
    expect(MOCK_JOBS.length).toBeGreaterThan(0);
  });

  it('events returns mock events', () => {
    expect(MOCK_EVENTS.length).toBeGreaterThan(0);
  });

  it('communities returns mock communities', () => {
    expect(MOCK_COMMUNITIES.length).toBeGreaterThan(0);
  });
});
