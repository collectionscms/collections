import { Content, ContentRevision, User } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentRevisionEntity } from '../contentRevision/contentRevision.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { ContentEntity } from './content.entity.js';

export class ContentRepository {
  async findOneById(prisma: ProjectPrismaType, id: string): Promise<ContentEntity | null> {
    const record = await prisma.content.findFirst({
      where: {
        id,
      },
      include: {
        createdBy: true,
      },
    });

    if (!record) return null;

    return ContentEntity.Reconstruct<Content, ContentEntity>(record);
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

  async findOneByIdOrSlug(
    prisma: ProjectPrismaType,
    identifier: string
  ): Promise<{ content: ContentEntity; createdBy: UserEntity } | null> {
    const record = await prisma.content.findFirst({
      where: {
        OR: [
          {
            id: identifier,
          },
          {
            slug: identifier,
          },
        ],
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
  ): Promise<{
    content: ContentEntity;
    revisions: ContentRevisionEntity[];
  } | null> {
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
        createdBy: true,
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

  async findWithDeletedByPostId(
    prisma: ProjectPrismaType,
    postId: string
  ): Promise<ContentEntity[]> {
    const records = await prisma.content.findMany({
      where: {
        postId,
      },
    });

    return records.map((record) => ContentEntity.Reconstruct<Content, ContentEntity>(record));
  }

  async findManyWithRevisionsByPostId(
    prisma: ProjectPrismaType,
    postId: string
  ): Promise<
    { content: ContentEntity; createdBy: UserEntity; revisions: ContentRevisionEntity[] }[]
  > {
    const records = await prisma.content.findMany({
      where: {
        postId,
        deletedAt: null,
      },
      orderBy: {
        currentVersion: 'desc',
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
        createdBy: true,
      },
    });

    return records.map((record) => ({
      content: ContentEntity.Reconstruct<Content, ContentEntity>(record),
      createdBy: UserEntity.Reconstruct<User, UserEntity>(record.createdBy),
      revisions: record.contentRevisions.map((r) =>
        ContentRevisionEntity.Reconstruct<ContentRevision, ContentRevisionEntity>(r)
      ),
    }));
  }

  async findPublishedContentsByCreatedById(
    prisma: ProjectPrismaType,
    userId: string
  ): Promise<ContentEntity[]> {
    const now = new Date();
    const records = await prisma.content.findMany({
      where: {
        createdById: userId,
        status: 'published',
        publishedAt: {
          lte: now,
        },
      },
      orderBy: {
        publishedAt: 'desc',
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
      data: {
        title: contentEntity.title,
        subtitle: contentEntity.subtitle,
        slug: contentEntity.slug,
        body: contentEntity.body,
        bodyJson: contentEntity.bodyJson,
        bodyHtml: contentEntity.bodyHtml,
        metaTitle: contentEntity.metaTitle,
        metaDescription: contentEntity.metaDescription,
        coverUrl: contentEntity.coverUrl,
        currentVersion: contentEntity.currentVersion,
        status: contentEntity.status,
        publishedAt: contentEntity.publishedAt,
        updatedById: contentEntity.updatedById,
      },
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
        currentVersion: contentEntity.currentVersion,
        status: contentEntity.status,
        publishedAt: contentEntity.publishedAt,
        updatedById: contentEntity.updatedById,
        deletedAt: contentEntity.deletedAt,
      },
    });

    return ContentEntity.Reconstruct<Content, ContentEntity>(record);
  }

  async trash(prisma: ProjectPrismaType, contentEntity: ContentEntity): Promise<ContentEntity> {
    contentEntity.beforeUpdateValidate();
    const record = await prisma.content.update({
      where: {
        id: contentEntity.id,
      },
      data: {
        status: contentEntity.status,
        updatedById: contentEntity.updatedById,
        deletedAt: contentEntity.deletedAt,
      },
    });

    return ContentEntity.Reconstruct<Content, ContentEntity>(record);
  }

  async restore(prisma: ProjectPrismaType, contentEntity: ContentEntity): Promise<ContentEntity> {
    contentEntity.beforeUpdateValidate();
    const record = await prisma.content.update({
      where: {
        id: contentEntity.id,
      },
      data: {
        status: contentEntity.status,
        currentVersion: contentEntity.currentVersion,
        deletedAt: contentEntity.deletedAt,
        updatedById: contentEntity.updatedById,
      },
    });

    return ContentEntity.Reconstruct<Content, ContentEntity>(record);
  }

  async delete(prisma: ProjectPrismaType, contentEntity: ContentEntity): Promise<void> {
    await prisma.content.delete({
      where: {
        id: contentEntity.id,
      },
    });
  }
}
