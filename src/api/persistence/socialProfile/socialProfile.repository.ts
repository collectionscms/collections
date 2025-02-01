import { SocialProfileEntity } from './socialProfile.entity.js';
import { BypassPrismaType } from '../../database/prisma/client.js';

export class SocialProfileRepository {
  async createMany(prisma: BypassPrismaType, socialProfiles: SocialProfileEntity[]): Promise<void> {
    await prisma.socialProfile.createMany({
      data: socialProfiles.map((socialProfile) => socialProfile.toPersistence()),
    });
  }

  async deleteManyByUserId(prisma: BypassPrismaType, userId: string): Promise<void> {
    await prisma.socialProfile.deleteMany({
      where: {
        userId,
      },
    });
  }
}
