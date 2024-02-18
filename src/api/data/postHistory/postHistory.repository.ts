import { PrismaType } from '../../database/prisma/client.js';
import { PostHistoryEntity } from './postHistory.entity.js';

export class PostHistoryRepository {
  async create(prisma: PrismaType, entity: PostHistoryEntity): Promise<PostHistoryEntity> {
    const record = await prisma.postHistory.create({
      data: entity.toPersistence(),
    });

    return PostHistoryEntity.Reconstruct(record);
  }
}
