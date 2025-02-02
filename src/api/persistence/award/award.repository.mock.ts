import { BypassPrismaType } from '../../database/prisma/client.js';
import { AwardEntity } from './award.entity.js';
import { AwardRepository } from './award.repository.js';

export class InMemoryAwardRepository extends AwardRepository {
  async createMany(_prisma: BypassPrismaType, _awards: AwardEntity[]): Promise<void> {
    return;
  }

  async deleteManyByUserId(_prisma: BypassPrismaType, _userId: string): Promise<void> {
    return;
  }
}
