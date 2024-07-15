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
        deletedAt: contentEntity.deletedAt,
      },
    });

    return ContentEntity.Reconstruct<Content, ContentEntity>(record);
  }
}
