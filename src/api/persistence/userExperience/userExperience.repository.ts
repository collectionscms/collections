import { BypassPrismaType } from '../../database/prisma/client.js';
import { UserExperienceEntity } from './userExperience.entity.js';

export class UserExperienceRepository {
  async createMany(
    prisma: BypassPrismaType,
    userExperiences: UserExperienceEntity[]
  ): Promise<void> {
    await prisma.userExperience.createMany({
      data: userExperiences.map((userExperience) => userExperience.toPersistence()),
    });
  }

  async deleteManyByUserId(prisma: BypassPrismaType, userId: string): Promise<void> {
    await prisma.userExperience.deleteMany({
      where: {
        userId,
      },
    });
  }
}
