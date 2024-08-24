import { User } from '@auth/express';
import { Content, ContentHistory, Post } from '@prisma/client';
import { validate as isUuid } from 'uuid';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from '../content/content.entity.js';
import { ContentHistoryEntity } from '../contentHistory/contentHistory.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { PostEntity } from './post.entity.js';

export class PostRepository {
  async findMany(
    prisma: ProjectPrismaType,
    options?: {
      userId?: string;
    }
  ): Promise<
    {
      post: PostEntity;
      contents: {
        content: ContentEntity;
        updatedBy: UserEntity;
        histories: ContentHistoryEntity[];
      }[];
    }[]
  > {
    const records = await prisma.post.findMany({
      include: {
        contentHistories: true,
        contents: {
          include: {
            updatedBy: true,
          },
          where: {
            deletedAt: null,
          },
        },
      },
      where: {
        createdById: options?.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const filteredRecords = records.filter((record) => record.contents.length > 0);
    return filteredRecords.map((record) => {
      const post = PostEntity.Reconstruct<Post, PostEntity>(record);
      const contents = [];
      for (const content of record.contents) {
        contents.push({
          content: ContentEntity.Reconstruct<Content, ContentEntity>(content),
          updatedBy: UserEntity.Reconstruct<User, UserEntity>(content.updatedBy),
          histories: record.contentHistories.map((history) =>
            ContentHistoryEntity.Reconstruct<ContentHistory, ContentHistoryEntity>(history)
          ),
        });
      }

      return {
        post,
        contents,
      };
    });
  }

  async findManyPublished(prisma: ProjectPrismaType): Promise<
    {
      post: PostEntity;
      contents: {
        content: ContentEntity;
        createdBy: UserEntity;
      }[];
    }[]
  > {
    const records = await prisma.post.findMany({
      include: {
        contents: {
          include: {
            createdBy: true,
          },
          where: {
            deletedAt: null,
            status: 'published',
          },
          orderBy: {
            version: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const filteredRecords = records.filter((record) => record.contents.length > 0);
    return filteredRecords.map((record) => {
      const post = PostEntity.Reconstruct<Post, PostEntity>(record);
      const contents = record.contents.map((content) => ({
        content: ContentEntity.Reconstruct<Content, ContentEntity>(content),
        createdBy: UserEntity.Reconstruct<User, UserEntity>(content.createdBy),
      }));

      return {
        post,
        contents,
      };
    });
  }

  async findOnePublished(
    prisma: ProjectPrismaType,
    key: string
  ): Promise<{
    post: PostEntity;
    contents: {
      content: ContentEntity;
      createdBy: UserEntity;
      updatedBy: UserEntity;
    }[];
  } | null> {
    const record = await prisma.post.findFirst({
      where: {
        OR: [{ id: isUuid(key) ? key : undefined }, { slug: key }],
      },
      include: {
        contents: {
          include: {
            createdBy: true,
            updatedBy: true,
          },
          where: {
            deletedAt: null,
            status: 'published',
          },
          orderBy: {
            version: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!record) {
      return null;
    }

    const post = PostEntity.Reconstruct<Post, PostEntity>(record);
    const contents = record.contents.map((content) => ({
      content: ContentEntity.Reconstruct<Content, ContentEntity>(content),
      createdBy: UserEntity.Reconstruct<User, UserEntity>(content.createdBy),
      updatedBy: UserEntity.Reconstruct<User, UserEntity>(content.updatedBy),
    }));

    return {
      post,
      contents,
    };
  }

  async findOneById(prisma: ProjectPrismaType, id: string): Promise<PostEntity> {
    const record = await prisma.post.findFirstOrThrow({
      where: {
        id,
      },
    });

    return PostEntity.Reconstruct<Post, PostEntity>(record);
  }

  async findOneBySlug(prisma: ProjectPrismaType, slug: string): Promise<PostEntity | null> {
    const record = await prisma.post.findFirst({
      where: {
        slug,
      },
    });

    return record ? PostEntity.Reconstruct<Post, PostEntity>(record) : null;
  }

  async findOneWithContentsById(
    prisma: ProjectPrismaType,
    id: string,
    options?: {
      userId?: string;
    }
  ): Promise<{
    post: PostEntity;
    contents: {
      content: ContentEntity;
      createdBy: UserEntity;
      histories: ContentHistoryEntity[];
    }[];
  }> {
    const record = await prisma.post.findFirstOrThrow({
      where: {
        id,
        createdById: options?.userId,
      },
      include: {
        contentHistories: true,
        contents: {
          include: {
            createdBy: true,
          },
          where: {
            deletedAt: null,
          },
          orderBy: {
            version: 'desc',
          },
        },
      },
    });

    const post = PostEntity.Reconstruct<Post, PostEntity>(record);
    const contents = [];
    for (const content of record.contents) {
      contents.push({
        content: ContentEntity.Reconstruct<Content, ContentEntity>(content),
        createdBy: UserEntity.Reconstruct<User, UserEntity>(content.createdBy),
        histories: record.contentHistories.map((history) =>
          ContentHistoryEntity.Reconstruct<ContentHistory, ContentHistoryEntity>(history)
        ),
      });
    }

    return {
      post,
      contents,
    };
  }

  async create(prisma: ProjectPrismaType, postEntity: PostEntity): Promise<PostEntity> {
    const record = await prisma.post.create({
      data: postEntity.toPersistence(),
    });

    return PostEntity.Reconstruct<Post, PostEntity>(record);
  }

  async updateSlug(prisma: ProjectPrismaType, postEntity: PostEntity): Promise<PostEntity> {
    const result = await prisma.post.update({
      where: {
        id: postEntity.id,
      },
      data: {
        slug: postEntity.slug,
      },
    });

    return PostEntity.Reconstruct<Post, PostEntity>(result);
  }
}
