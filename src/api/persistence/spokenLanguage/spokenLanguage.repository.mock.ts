import { BypassPrismaType } from '../../database/prisma/client.js';
import { SpokenLanguageEntity } from './spokenLanguage.entity.js';
import { SpokenLanguageRepository } from './spokenLanguage.repository.js';

export class InMemorySpokenLanguageRepository extends SpokenLanguageRepository {
  async createMany(
    _prisma: BypassPrismaType,
    _spokenLanguages: SpokenLanguageEntity[]
  ): Promise<void> {
    return;
  }

  async deleteManyByUserId(_prisma: BypassPrismaType, _userId: string): Promise<void> {
    return;
  }
}
