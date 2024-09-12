import { Content, User } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { UserEntity } from '../user/user.entity.js';
import { ContentEntity } from './content.entity.js';

export class ContentRepository {
  async findOneById(prisma: ProjectPrismaType, id: string): Promise<ContentEntity> {
    const record = await prisma.content.findFirstOrThrow({
      where: {
        id,
      },
    });

    return ContentEntity.Reconstruct<Content, ContentEntity>(record);
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

  async findManyByPostIdAndLanguage(
    prisma: ProjectPrismaType,
    postId: string,
    language: string
  ): Promise<ContentEntity[]> {
    const records = await prisma.content.findMany({
      where: {
        postId,
        language,
        deletedAt: null,
      },
      orderBy: {
        version: 'desc',
      },
    });

    return records.map((record) => ContentEntity.Reconstruct<Content, ContentEntity>(record));
  }

  async findManyByPostId(prisma: ProjectPrismaType, postId: string): Promise<ContentEntity[]> {
    const records = await prisma.content.findMany({
      where: {
        postId,
        deletedAt: null,
      },
    });

    return records.map((record) => ContentEntity.Reconstruct<Content, ContentEntity>(record));
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
