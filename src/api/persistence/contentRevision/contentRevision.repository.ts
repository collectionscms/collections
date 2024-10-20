import { ContentRevision } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentRevisionEntity } from './contentRevision.entity.js';

export class ContentRevisionRepository {
  async findOneById(prisma: ProjectPrismaType, id: string): Promise<ContentRevisionEntity | null> {
    const record = await prisma.contentRevision.findUnique({
      where: {
        id,
      },
    });

    if (!record) return null;

    return ContentRevisionEntity.Reconstruct<ContentRevision, ContentRevisionEntity>(record);
  }

  async findOneByPostIdAndLanguage(
    prisma: ProjectPrismaType,
    postId: string,
    language: string
  ): Promise<ContentRevisionEntity | null> {
    const record = await prisma.contentRevision.findFirst({
      where: {
        postId,
        language,
        deletedAt: null,
      },
      orderBy: {
        version: 'desc',
      },
    });

    if (!record) return null;

    return ContentRevisionEntity.Reconstruct<ContentRevision, ContentRevisionEntity>(record);
  }

  async findLatestOneByContentId(
    prisma: ProjectPrismaType,
    contentId: string
  ): Promise<ContentRevisionEntity | null> {
    const record = await prisma.contentRevision.findFirst({
      where: {
        contentId,
        deletedAt: null,
      },
      orderBy: {
        version: 'desc',
      },
    });

    if (!record) return null;

    return ContentRevisionEntity.Reconstruct<ContentRevision, ContentRevisionEntity>(record);
  }

  async findManyTrashed(prisma: ProjectPrismaType): Promise<ContentRevisionEntity[]> {
    const records = await prisma.contentRevision.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
      orderBy: {
        deletedAt: 'desc',
      },
    });

    return records.map((record) =>
      ContentRevisionEntity.Reconstruct<ContentRevision, ContentRevisionEntity>(record)
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

  async deleteAfterVersion(
    prisma: ProjectPrismaType,
    contentId: string,
    version: number
  ): Promise<void> {
    await prisma.contentRevision.deleteMany({
      where: {
        contentId,
        version: {
          gt: version,
        },
      },
    });
  }
}
