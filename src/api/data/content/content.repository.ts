import { PrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from './content.entity.js';

export class ContentRepository {
  async create(prisma: PrismaType, contentEntity: ContentEntity): Promise<ContentEntity> {
    const record = await prisma.content.create({
      data: contentEntity.toPersistence(),
    });

    return ContentEntity.Reconstruct(record);
  }
}
