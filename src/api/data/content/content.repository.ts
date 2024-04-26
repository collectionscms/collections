import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from './content.entity.js';

export class ContentRepository {
  async findOneById(
    prisma: ProjectPrismaType,
    id: string,
    projectId: string
  ): Promise<ContentEntity> {
    const record = await prisma.content.findFirstOrThrow({
      where: {
        id,
        projectId,
      },
    });

    return ContentEntity.Reconstruct(record);
  }

  async create(prisma: ProjectPrismaType, contentEntity: ContentEntity): Promise<ContentEntity> {
    const record = await prisma.content.create({
      data: contentEntity.toPersistence(),
    });

    return ContentEntity.Reconstruct(record);
  }

  async update(prisma: ProjectPrismaType, contentEntity: ContentEntity): Promise<ContentEntity> {
    contentEntity.beforeValidate();

    const record = await prisma.content.update({
      where: {
        id: contentEntity.id(),
      },
      data: contentEntity.toPersistence(),
    });

    return ContentEntity.Reconstruct(record);
  }
}
