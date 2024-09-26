import { ContentRevision } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentRevisionEntity } from './contentRevision.entity.js';

export class ContentRevisionRepository {
  async findLatestOneByContentId(
    prisma: ProjectPrismaType,
    contentId: string
  ): Promise<ContentRevisionEntity | null> {
    const record = await prisma.contentRevision.findFirst({
      where: {
        contentId,
      },
      orderBy: {
        version: 'desc',
      },
    });

    if (!record) return null;

    return ContentRevisionEntity.Reconstruct<ContentRevision, ContentRevisionEntity>(record);
  }

  async create(
    prisma: ProjectPrismaType,
    entity: ContentRevisionEntity
  ): Promise<ContentRevisionEntity> {
    entity.beforeInsertValidate();

    const record = await prisma.contentRevision.create({
      data: entity.toPersistence(),
    });

    return ContentRevisionEntity.Reconstruct<ContentRevision, ContentRevisionEntity>(record);
  }

  async update(
    prisma: ProjectPrismaType,
    entity: ContentRevisionEntity
  ): Promise<ContentRevisionEntity> {
    entity.beforeUpdateValidate();

    const record = await prisma.contentRevision.update({
      where: {
        id: entity.id,
      },
      data: entity.toPersistence(),
    });

    return ContentRevisionEntity.Reconstruct<ContentRevision, ContentRevisionEntity>(record);
  }
}
