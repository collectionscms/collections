import { v4 } from 'uuid';
import { ContentStatus } from '../../persistence/content/content.entity.js';
import { generateKey } from '../../utilities/generateKey.js';
import { BypassPrismaType } from '../prisma/client.js';

export const createPost = async (
  prisma: BypassPrismaType,
  projectId: string,
  contents: {
    language: string;
    slug: string;
    title: string;
    subtitle: string | null;
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
      id: options?.createdById,
    },
  });
  const postId = options?.postId ?? v4();

  const postContents = [];
  const contentRevisions = [];
  for (const content of contents) {
    const contentId = v4();
    postContents.push({
      id: contentId,
      projectId,
      status: content.status,
      publishedAt: content.status === ContentStatus.published ? currentTime : null,
      language: content.language,
      currentVersion: 1,
      slug: encodeURIComponent(content.slug),
      title: content.title,
      subtitle: content.subtitle,
      body: content.body,
      bodyJson: content.bodyJson,
      bodyHtml: content.bodyHtml,
      coverUrl: content.coverUrl,
      draftKey: generateKey(),
      createdById: user.id,
      updatedById: user.id,
    });

    contentRevisions.push({
      id: v4(),
      projectId,
      contentId,
      status: content.status,
      publishedAt: content.status === ContentStatus.published ? currentTime : null,
      language: content.language,
      version: 1,
      slug: encodeURIComponent(content.slug),
      title: content.title,
      subtitle: content.subtitle,
      body: content.body,
      bodyJson: content.bodyJson,
      bodyHtml: content.bodyHtml,
      coverUrl: content.coverUrl,
      draftKey: generateKey(),
      createdById: user.id,
      updatedById: user.id,
    });
  }

  await prisma.post.create({
    data: {
      id: postId,
      projectId,
      createdById: user.id,
      createdAt: currentTime,
      updatedAt: currentTime,
      contents: {
        create: postContents,
      },
      contentRevisions: {
        create: contentRevisions,
      },
    },
  });
};
