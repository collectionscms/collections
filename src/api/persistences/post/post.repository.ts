import { User } from '@auth/express';
import { Content, ContentHistory, File, Post } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from '../content/content.entity.js';
import { ContentHistoryEntity } from '../contentHistory/contentHistory.entity.js';
import { FileEntity } from '../file/file.entity.js';
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
        file: FileEntity | null;
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
            file: true,
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
          file: content.file ? FileEntity.Reconstruct<File, FileEntity>(content.file) : null,
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
        file: FileEntity | null;
        createdBy: UserEntity;
        updatedBy: UserEntity;
      }[];
    }[]
  > {
    const records = await prisma.post.findMany({
      include: {
        contents: {
          include: {
            file: true,
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

    const filteredRecords = records.filter((record) => record.contents.length > 0);
    return filteredRecords.map((record) => {
      const post = PostEntity.Reconstruct<Post, PostEntity>(record);
      const contents = record.contents.map((content) => ({
        content: ContentEntity.Reconstruct<Content, ContentEntity>(content),
        file: content.file ? FileEntity.Reconstruct<File, FileEntity>(content.file) : null,
        createdBy: UserEntity.Reconstruct<User, UserEntity>(content.createdBy),
        updatedBy: UserEntity.Reconstruct<User, UserEntity>(content.updatedBy),
      }));

      return {
        post,
        contents,
      };
    });
  }

  async findOnePublished(
    prisma: ProjectPrismaType,
    slug: string
  ): Promise<{
    post: PostEntity;
    contents: {
      content: ContentEntity;
      file: FileEntity | null;
      createdBy: UserEntity;
      updatedBy: UserEntity;
    }[];
  } | null> {
    const record = await prisma.post.findFirst({
      where: {
        slug,
      },
      include: {
        contents: {
          include: {
            file: true,
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
      file: content.file ? FileEntity.Reconstruct<File, FileEntity>(content.file) : null,
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
      file: FileEntity | null;
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
            file: true,
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
        file: content.file ? FileEntity.Reconstruct<File, FileEntity>(content.file) : null,
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
