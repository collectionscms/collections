import { Content, Tag, User } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from '../content/content.entity.js';
import { TagEntity } from '../tag/tag.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { ContentTagEntity } from './contentTag.entity.js';

export class ContentTagRepository {
  async findTagsByContentId(prisma: ProjectPrismaType, contentId: string): Promise<TagEntity[]> {
    const records = await prisma.contentTag.findMany({
      where: {
        contentId,
      },
      include: {
        tag: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return records.map((record) => TagEntity.Reconstruct<Tag, TagEntity>(record.tag));
  }

  async findPublishedContentsByTagId(
    prisma: ProjectPrismaType,
    tagId: string
  ): Promise<{ content: ContentEntity; createdBy: UserEntity | null }[]> {
    const now = new Date();
    const records = await prisma.contentTag.findMany({
      where: {
        tagId,
        content: {
          status: 'published',
          publishedAt: {
            lte: now,
          },
        },
      },
      include: {
        content: {
          include: {
            createdBy: true,
          },
        },
      },
      orderBy: {
        content: {
          publishedAt: 'desc',
        },
      },
    });

    return records.map((record) => ({
      content: ContentEntity.Reconstruct<Content, ContentEntity>(record.content),
      createdBy: record.content.createdBy
        ? UserEntity.Reconstruct<User, UserEntity>(record.content.createdBy)
        : null,
    }));
  }

  async createMany(prisma: ProjectPrismaType, entities: ContentTagEntity[]): Promise<void> {
    for (const entity of entities) {
      entity.beforeInsertValidate();
    }

    await prisma.contentTag.createMany({
      data: entities.map((entity) => entity.toPersistence()),
    });
  }

  async deleteManyByContentId(prisma: ProjectPrismaType, contentId: string): Promise<void> {
    await prisma.contentTag.deleteMany({
      where: {
        contentId,
      },
    });
  }
}
