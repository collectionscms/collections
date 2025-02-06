import { BypassPrismaType } from '../../database/prisma/client.js';
import { UserExperienceEntity } from './userExperience.entity.js';
import { UserExperienceRepository } from './userExperience.repository.js';

export class InMemoryUserExperienceRepository extends UserExperienceRepository {
  async createMany(
    _prisma: BypassPrismaType,
    _userExperiences: UserExperienceEntity[]
  ): Promise<void> {
    return;
  }

  async deleteManyByUserId(_prisma: BypassPrismaType, _userId: string): Promise<void> {
    return;
  }
}
