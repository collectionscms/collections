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

  async findManyByPostIdWithLanguage(
    prisma: ProjectPrismaType,
    postId: string,
    language: string
  ): Promise<ContentRevisionEntity[]> {
    const record = await prisma.contentRevision.findMany({
      where: {
        postId,
        language,
        deletedAt: null,
      },
    });

    return record.map((r) =>
      ContentRevisionEntity.Reconstruct<ContentRevision, ContentRevisionEntity>(r)
    );
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

  async createMany(
    prisma: ProjectPrismaType,
    entities: ContentRevisionEntity[]
  ): Promise<ContentRevisionEntity[]> {
    await prisma.contentRevision.createMany({
      data: entities.map((entity) => entity.toPersistence()),
    });

    return entities;
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
