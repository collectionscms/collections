import { BypassPrismaType } from '../../database/prisma/client.js';
import { SocialProfileEntity } from './socialProfile.entity.js';
import { SocialProfileRepository } from './socialProfile.repository.js';

export class InMemorySocialProfileRepository extends SocialProfileRepository {
  async createMany(
    _prisma: BypassPrismaType,
    _socialProfiles: SocialProfileEntity[]
  ): Promise<void> {
    return;
  }

  async deleteManyByUserId(_prisma: BypassPrismaType, _userId: string): Promise<void> {
    return;
  }
}
