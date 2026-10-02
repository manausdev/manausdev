import type { Report, Verification } from '@/types/database';

export type ReportStatus = 'open' | 'reviewed' | 'resolved' | 'dismissed';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface ModerationDomainModel {
  reports: Report[];
  verifications: Verification[];
}
