import type { Badge, UserBadge, ReputationEvent } from '@/types/database';

export class ContributionsRepository {
  async listBadges(): Promise<Badge[]> {
    return [];
  }
  async listUserBadges(userId: string): Promise<UserBadge[]> {
    return [];
  }
  async listReputationEvents(userId: string): Promise<ReputationEvent[]> {
    return [];
  }
}
