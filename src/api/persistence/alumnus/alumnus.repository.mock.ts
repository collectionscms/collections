import { BypassPrismaType } from '../../database/prisma/client.js';
import { AlumnusEntity } from './alumnus.entity.js';
import { AlumnusRepository } from './alumnus.repository.js';

export class InMemoryAlumnusRepository extends AlumnusRepository {
  async createMany(_prisma: BypassPrismaType, _alumni: AlumnusEntity[]): Promise<void> {
    return;
  }

  async deleteManyByUserId(_prisma: BypassPrismaType, _userId: string): Promise<void> {
    return;
  }
}
