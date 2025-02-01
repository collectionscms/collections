import { BypassPrismaType } from '../../database/prisma/client.js';
import { AwardEntity } from './award.entity.js';

export class AwardRepository {
  async createMany(prisma: BypassPrismaType, awards: AwardEntity[]): Promise<void> {
    await prisma.award.createMany({
      data: awards.map((award) => award.toPersistence()),
    });
  }

  async deleteManyByUserId(prisma: BypassPrismaType, userId: string): Promise<void> {
    await prisma.award.deleteMany({
      where: {
        userId,
      },
    });
  }
}
