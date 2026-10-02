import { describe, it, expect } from 'vitest';
import { ContributionsService } from './service';
import { ContributionsRepository } from './repository';

describe('ContributionsService', () => {
  it('calculates reputation score from events', async () => {
    const repo = new ContributionsRepository();
    // Mock repo
    (repo as any).listReputationEvents = async () => [
      { points: 10 },
      { points: 20 },
    ];
    const service = new ContributionsService(repo);
    const score = await service.getReputationScore('user-1');
    expect(score.total_points).toBe(30);
    expect(score.events_count).toBe(2);
  });
});
