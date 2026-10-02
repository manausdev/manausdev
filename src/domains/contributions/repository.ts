import type { ReputationEvent } from '@/types/database';

export class ContributionsRepository {
  async listBadges() {
    return [];
  }
  async listUserBadges(userId: string) {
    return [];
  }
  async listReputationEvents(userId: string): Promise<ReputationEvent[]> {
    return [];
  }
}
