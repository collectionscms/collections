import { Content, ContentRevision, User } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentRevisionEntity } from '../contentRevision/contentRevision.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { ContentEntity } from './content.entity.js';

export class ContentRepository {
  async findOneById(
    prisma: ProjectPrismaType,
    id: string
  ): Promise<{ content: ContentEntity; createdBy: UserEntity }> {
    const { createdBy, ...content } = await prisma.content.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        createdBy: true,
      },
    });

    return {
      content: ContentEntity.Reconstruct<Content, ContentEntity>(content),
      createdBy: UserEntity.Reconstruct<User, UserEntity>(createdBy),
    };
  }

  async findOneByPostIdAndLanguage(
    prisma: ProjectPrismaType,
    excludeId: string,
    postId: string,
    language: string
  ): Promise<ContentEntity | null> {
    const record = await prisma.content.findFirst({
      where: {
        id: {
          not: excludeId,
        },
        postId,
        language,
        deletedAt: null,
      },
    });

    return record ? ContentEntity.Reconstruct<Content, ContentEntity>(record) : null;
  }

  async findOneBySlug(
    prisma: ProjectPrismaType,
    slug: string
  ): Promise<{ content: ContentEntity; createdBy: UserEntity } | null> {
    const record = await prisma.content.findFirst({
      where: {
        slug,
      },
      include: {
        createdBy: true,
      },
    });

    if (!record) {
      return null;
    }

    return {
      content: ContentEntity.Reconstruct<Content, ContentEntity>(record),
      createdBy: UserEntity.Reconstruct<User, UserEntity>(record.createdBy),
    };
  }

  async findOneWithRevisionsById(
    prisma: ProjectPrismaType,
    id: string
  ): Promise<{ content: ContentEntity; revisions: ContentRevisionEntity[] } | null> {
    const record = await prisma.content.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        contentRevisions: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            version: 'desc',
          },
        },
      },
    });

    if (!record) {
      return null;
    }

    return {
      content: ContentEntity.Reconstruct<Content, ContentEntity>(record),
      revisions: record.contentRevisions.map((r) =>
        ContentRevisionEntity.Reconstruct<ContentRevision, ContentRevisionEntity>(r)
      ),
    };
  }

  async findManyByPostIdAndLanguage(
    prisma: ProjectPrismaType,
    postId: string,
    language: string
  ): Promise<{ content: ContentEntity; createdBy: UserEntity }[]> {
    const records = await prisma.content.findMany({
      where: {
        postId,
        language,
        deletedAt: null,
      },
      orderBy: {
        currentVersion: 'desc',
      },
      include: {
        createdBy: true,
      },
    });

    return records.map((record) => ({
      content: ContentEntity.Reconstruct<Content, ContentEntity>(record),
      createdBy: UserEntity.Reconstruct<User, UserEntity>(record.createdBy),
    }));
  }

  async findManyByPostId(
    prisma: ProjectPrismaType,
    postId: string
  ): Promise<{ content: ContentEntity; createdBy: UserEntity }[]> {
    const records = await prisma.content.findMany({
      where: {
        postId,
        deletedAt: null,
      },
      orderBy: {
        currentVersion: 'desc',
      },
      include: {
        createdBy: true,
      },
    });

    return records.map((record) => ({
      content: ContentEntity.Reconstruct<Content, ContentEntity>(record),
      createdBy: UserEntity.Reconstruct<User, UserEntity>(record.createdBy),
    }));
  }

  async findManyTrashed(prisma: ProjectPrismaType): Promise<ContentEntity[]> {
    const records = await prisma.content.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
      orderBy: {
        deletedAt: 'desc',
      },
    });

    return records.map((record) => ContentEntity.Reconstruct<Content, ContentEntity>(record));
  }

  async create(
    prisma: ProjectPrismaType,
    contentEntity: ContentEntity
  ): Promise<{ content: ContentEntity; createdBy: UserEntity }> {
    contentEntity.beforeInsertValidate();

    const record = await prisma.content.create({
      data: contentEntity.toPersistence(),
      include: {
        createdBy: true,
      },
    });

    return {
      content: ContentEntity.Reconstruct<Content, ContentEntity>(record),
      createdBy: UserEntity.Reconstruct<User, UserEntity>(record.createdBy),
    };
  }

  async update(prisma: ProjectPrismaType, contentEntity: ContentEntity): Promise<ContentEntity> {
    contentEntity.beforeUpdateValidate();

    const record = await prisma.content.update({
      where: {
        id: contentEntity.id,
      },
      data: contentEntity.toPersistence(),
    });

    return ContentEntity.Reconstruct<Content, ContentEntity>(record);
  }

  async updateStatus(
    prisma: ProjectPrismaType,
    contentEntity: ContentEntity
  ): Promise<ContentEntity> {
    contentEntity.beforeUpdateValidate();
    const record = await prisma.content.update({
      where: {
        id: contentEntity.id,
      },
      data: {
        status: contentEntity.status,
        publishedAt: contentEntity.publishedAt,
        updatedById: contentEntity.updatedById,
      },
    });

    return ContentEntity.Reconstruct<Content, ContentEntity>(record);
  }

  async delete(prisma: ProjectPrismaType, contentEntity: ContentEntity): Promise<ContentEntity> {
    contentEntity.beforeUpdateValidate();
    const record = await prisma.content.update({
      where: {
        id: contentEntity.id,
      },
      data: {
        deletedAt: contentEntity.deletedAt,
        updatedById: contentEntity.updatedById,
      },
    });

    return ContentEntity.Reconstruct<Content, ContentEntity>(record);
  }

  async hardDelete(prisma: ProjectPrismaType, contentEntity: ContentEntity): Promise<void> {
    contentEntity.beforeUpdateValidate();
    await prisma.content.delete({
      where: {
        id: contentEntity.id,
      },
    });
  }

  async restore(prisma: ProjectPrismaType, contentEntity: ContentEntity): Promise<ContentEntity> {
    contentEntity.beforeUpdateValidate();
    const record = await prisma.content.update({
      where: {
        id: contentEntity.id,
      },
      data: {
        deletedAt: contentEntity.deletedAt,
        updatedById: contentEntity.updatedById,
      },
    });

    return ContentEntity.Reconstruct<Content, ContentEntity>(record);
  }
}
