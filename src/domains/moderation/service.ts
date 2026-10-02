import { ModerationRepository } from './repository';

export class ModerationService {
  constructor(private repo: ModerationRepository = new ModerationRepository()) {}

  async canReview(userId: string) {
    // Simplified: admin check would be done via RLS
    return true;
  }
}
