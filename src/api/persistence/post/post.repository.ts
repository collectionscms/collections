import { User } from '@auth/express';
import { Content, ContentRevision, Post } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from '../content/content.entity.js';
import { ContentRevisionEntity } from '../contentRevision/contentRevision.entity.js';
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
        revisions: ContentRevisionEntity[];
      }[];
    }[]
  > {
    const records = await prisma.post.findMany({
      include: {
        contentRevisions: true,
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
          revisions: record.contentRevisions.map((revision) =>
            ContentRevisionEntity.Reconstruct<ContentRevision, ContentRevisionEntity>(revision)
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
            currentVersion: 'desc',
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

  async findOnePublishedById(
    prisma: ProjectPrismaType,
    id: string
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
        id,
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
            currentVersion: 'desc',
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
      updatedBy: UserEntity;
    }[];
  }> {
    const record = await prisma.post.findFirstOrThrow({
      where: {
        id,
        createdById: options?.userId,
      },
      include: {
        contents: {
          include: {
            createdBy: true,
            updatedBy: true,
          },
          where: {
            deletedAt: null,
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
        updatedBy: UserEntity.Reconstruct<User, UserEntity>(content.updatedBy),
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
}
