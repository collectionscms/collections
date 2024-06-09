import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { contentStatus } from '../../data/content/content.entity.js';
import { StatusType } from '../../data/post/post.entity.js';
import { reviewStatus } from '../../data/review/review.entity.js';
import { BypassPrismaType } from '../prisma/client.js';
import { adminUser } from './createUsers.js';

export const createPost = async (
  prisma: BypassPrismaType,
  projectId: string,
  options?: {
    id?: string;
    slug?: string;
    status?: StatusType;
    publishedAt?: Date;
    defaultLocale?: string;
    version?: number;
    createdById?: string;
  }
): Promise<void> => {
  const currentTime = new Date();
  const title = faker.music.songName();
  const body = faker.lorem.lines(3);
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: options?.createdById ?? adminUser,
    },
  });

  const reviewData =
    options?.defaultLocale === 'ja'
      ? {
          title: `記事を書いた！`,
          body: `「${title}」というタイトルの記事を書いたので、レビューをお願いします`,
        }
      : {
          title: `I wrote a post!`,
          body: `Please review the post entitled '${title}'`,
        };

  const postId = options?.id ?? v4();

  await prisma.post.create({
    data: {
      id: postId,
      projectId,
      slug: options?.slug ?? faker.lorem.slug(),
      defaultLocale: options?.defaultLocale ?? 'en',
      createdAt: currentTime,
      updatedAt: currentTime,
      contents: {
        create: {
          id: v4(),
          projectId,
          status: options?.status ?? contentStatus.published,
          publishedAt: options?.publishedAt ?? currentTime,
          locale: options?.defaultLocale ?? 'en',
          version: options?.version ?? 0,
          title: title,
          body: body,
          // todo: add
          bodyJson: '{}',
          bodyHtml: `<p>${body}</p>`,
          createdById: user.id,
          createdAt: currentTime,
          updatedAt: currentTime,
          review:
            options?.status === contentStatus.review
              ? {
                  create: {
                    id: v4(),
                    projectId,
                    postId,
                    revieweeId: user.id,
                    title: reviewData.title,
                    body: reviewData.body,
                    status: reviewStatus.Request,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                  },
                }
              : {},
        },
      },
      postHistories: {
        create: {
          id: v4(),
          projectId,
          userId: user.id,
          status: options?.status ?? 'published',
          version: options?.version ?? 0,
          createdAt: currentTime,
        },
      },
    },
  });
};
