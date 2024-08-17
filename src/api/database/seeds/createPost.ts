import { faker } from '@faker-js/faker';
import { i18n } from 'i18next';
import { v4 } from 'uuid';
import { ContentStatusType, contentStatus } from '../../data/content/content.entity.js';
import { reviewStatus } from '../../data/review/review.entity.js';
import { BypassPrismaType } from '../prisma/client.js';
import { adminUser } from './createUsers.js';

export const createPost = async (
  prisma: BypassPrismaType,
  projectId: string,
  i18next: i18n,
  options?: {
    id?: string;
    slug?: string;
    status?: ContentStatusType;
    publishedAt?: Date;
    language?: string;
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

  i18next.changeLanguage(options?.language);
  const reviewComment = i18next.t('seed.review_comment', { title });

  const postId = options?.id ?? v4();

  await prisma.post.create({
    data: {
      id: postId,
      projectId,
      slug: options?.slug ?? faker.lorem.slug(),
      createdById: user.id,
      createdAt: currentTime,
      updatedAt: currentTime,
      contents: {
        create: {
          id: v4(),
          projectId,
          status: options?.status ?? contentStatus.published,
          publishedAt: options?.publishedAt,
          language: options?.language ?? 'en',
          version: options?.version ?? 1,
          title: title,
          body: body,
          // todo: add
          bodyJson: '{}',
          bodyHtml: `<p>${body}</p>`,
          createdById: user.id,
          updatedById: user.id,
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
                    comment: reviewComment,
                    status: reviewStatus.Request,
                    createdAt: currentTime,
                    updatedAt: currentTime,
                  },
                }
              : {},
        },
      },
      contentHistories: {
        create: {
          id: v4(),
          projectId,
          createdById: user.id,
          updatedById: user.id,
          status: options?.status ?? contentStatus.published,
          version: options?.version ?? 1,
          createdAt: currentTime,
          language: options?.language ?? 'en',
        },
      },
    },
  });
};
