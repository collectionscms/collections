import { v4 } from 'uuid';
import { contentStatus } from '../../persistences/content/content.entity.js';
import { BypassPrismaType } from '../prisma/client.js';
import { adminUser } from './createUsers.js';

export const createPost = async (
  prisma: BypassPrismaType,
  projectId: string,
  slug: string,
  contents: {
    language: string;
    title: string;
    body: string;
    bodyJson: string;
    bodyHtml: string;
    status: string;
    coverUrl?: string;
  }[],
  options?: {
    postId?: string;
    createdById?: string;
  }
): Promise<void> => {
  const currentTime = new Date();
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: options?.createdById ?? adminUser,
    },
  });
  const postId = options?.postId ?? v4();

  const postContents = [];
  for (const content of contents) {
    postContents.push({
      id: v4(),
      projectId,
      status: content.status,
      publishedAt: content.status === contentStatus.published ? currentTime : null,
      language: content.language,
      version: 1,
      title: content.title,
      body: content.body,
      bodyJson: content.bodyJson,
      bodyHtml: content.bodyHtml,
      coverUrl: content.coverUrl,
      createdById: user.id,
      updatedById: user.id,
    });
  }

  await prisma.post.create({
    data: {
      id: postId,
      projectId,
      slug: slug,
      createdById: user.id,
      createdAt: currentTime,
      updatedAt: currentTime,
      contents: {
        create: postContents,
      },
      contentHistories: {
        create: postContents,
      },
    },
  });
};
