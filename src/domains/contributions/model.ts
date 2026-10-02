import type { Badge, UserBadge, ReputationEvent } from '@/types/database';

export interface BadgeCriteria {
  type: 'count' | 'exists';
  source: string;
  min?: number;
}

export interface ReputationScore {
  user_id: string;
  total_points: number;
  events_count: number;
}

export type ContributionDomainModel = {
  badges: Badge[];
  userBadges: UserBadge[];
  reputationEvents: ReputationEvent[];
};
