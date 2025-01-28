import { User } from '@auth/express';
import { Content, ContentRevision, Post } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from '../content/content.entity.js';
import { ContentRevisionEntity } from '../contentRevision/contentRevision.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { PostEntity } from './post.entity.js';

export class PostRepository {
  async findOneById(prisma: ProjectPrismaType, id: string): Promise<PostEntity | null> {
    const record = await prisma.post.findUnique({
      where: { id },
    });
    return record ? PostEntity.Reconstruct<Post, PostEntity>(record) : null;
  }

  async findOnePublishedById(
    prisma: ProjectPrismaType,
    id: string
  ): Promise<{
    post: PostEntity;
    contents: {
      content: ContentEntity;
      createdBy: UserEntity | null;
      updatedBy: UserEntity | null;
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
      createdBy: content.createdBy
        ? UserEntity.Reconstruct<User, UserEntity>(content.createdBy)
        : null,
      updatedBy: content.updatedBy
        ? UserEntity.Reconstruct<User, UserEntity>(content.updatedBy)
        : null,
    }));

    return {
      post,
      contents,
    };
  }

  async findOneByIsInit(prisma: ProjectPrismaType): Promise<{
    post: PostEntity;
    content: ContentEntity;
    revision: ContentRevisionEntity;
  } | null> {
    const record = await prisma.post.findFirst({
      where: {
        isInit: true,
      },
      include: {
        contents: true,
        contentRevisions: true,
      },
    });

    return record
      ? {
          post: PostEntity.Reconstruct<Post, PostEntity>(record),
          content: ContentEntity.Reconstruct<Content, ContentEntity>(record.contents[0]),
          revision: ContentRevisionEntity.Reconstruct<ContentRevision, ContentRevisionEntity>(
            record.contentRevisions[0]
          ),
        }
      : null;
  }

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
        revisions: ContentRevisionEntity[];
      }[];
    }[]
  > {
    const records = await prisma.post.findMany({
      include: {
        contents: {
          where: {
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
        },
      },
      where: {
        isInit: false,
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
          revisions: content.contentRevisions.map((revision) =>
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
        createdBy: UserEntity | null;
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
        createdBy: content.createdBy
          ? UserEntity.Reconstruct<User, UserEntity>(content.createdBy)
          : null,
      }));

      return {
        post,
        contents,
      };
    });
  }

  async create(prisma: ProjectPrismaType, postEntity: PostEntity): Promise<PostEntity> {
    postEntity.beforeInsertValidate();

    const record = await prisma.post.create({
      data: postEntity.toPersistence(),
    });

    return PostEntity.Reconstruct<Post, PostEntity>(record);
  }

  async update(prisma: ProjectPrismaType, postEntity: PostEntity): Promise<PostEntity> {
    postEntity.beforeUpdateValidate();

    const record = await prisma.post.update({
      where: { id: postEntity.id },
      data: postEntity.toPersistence(),
    });

    return PostEntity.Reconstruct<Post, PostEntity>(record);
  }
}
