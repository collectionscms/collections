import { PostHistory } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { PostHistoryEntity } from './postHistory.entity.js';

export class PostHistoryRepository {
  async create(prisma: ProjectPrismaType, entity: PostHistoryEntity): Promise<PostHistoryEntity> {
    entity.beforeInsertValidate();

    const record = await prisma.postHistory.create({
      data: entity.toPersistence(),
    });

    return PostHistoryEntity.Reconstruct<PostHistory, PostHistoryEntity>(record);
  }
}
