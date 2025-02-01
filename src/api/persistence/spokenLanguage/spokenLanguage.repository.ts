import { BypassPrismaType } from '../../database/prisma/client.js';
import { SpokenLanguageEntity } from './spokenLanguage.entity.js';

export class SpokenLanguageRepository {
  async createMany(
    prisma: BypassPrismaType,
    spokenLanguages: SpokenLanguageEntity[]
  ): Promise<void> {
    await prisma.spokenLanguage.createMany({
      data: spokenLanguages.map((spokenLanguage) => spokenLanguage.toPersistence()),
    });
  }

  async deleteManyByUserId(prisma: BypassPrismaType, userId: string): Promise<void> {
    await prisma.spokenLanguage.deleteMany({
      where: {
        userId,
      },
    });
  }
}
