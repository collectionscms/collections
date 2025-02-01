import { BypassPrismaType } from '../../database/prisma/client.js';
import { AlumnusEntity } from './alumnus.entity.js';

export class AlumnusRepository {
  async createMany(prisma: BypassPrismaType, alumnus: AlumnusEntity[]): Promise<void> {
    await prisma.alumnus.createMany({
      data: alumnus.map((alumnus) => alumnus.toPersistence()),
    });
  }

  async deleteManyByUserId(prisma: BypassPrismaType, userId: string): Promise<void> {
    await prisma.alumnus.deleteMany({
      where: {
        userId,
      },
    });
  }
}
