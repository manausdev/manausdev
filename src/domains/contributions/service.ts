import { ContributionsRepository } from './repository';

export class ContributionsService {
  constructor(private repo: ContributionsRepository = new ContributionsRepository()) {}

  async getReputationScore(userId: string) {
    const events = await this.repo.listReputationEvents(userId);
    const total_points = events.reduce((sum, e) => sum + e.points, 0);
    return { user_id: userId, total_points, events_count: events.length };
  }
}
