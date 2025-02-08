import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { ProjectPrismaType } from '../database/prisma/client.js';
import { ContentEntity } from '../persistence/content/content.entity.js';
import { ContentRepository } from '../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../persistence/contentRevision/contentRevision.repository.js';

export class ContentService {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository
  ) {}

  async publish(
    prisma: ProjectPrismaType,
    userId: string,
    content: ContentEntity,
    revisions: ContentRevisionEntity[]
  ): Promise<ContentEntity> {
    const latestRevision = ContentRevisionEntity.getLatestRevisionOfLanguage(
      revisions,
      content.language
    );

    const encodedSlug = encodeURIComponent(latestRevision.slug);
    const sameSlugContent = await this.contentRepository.findOneBySlug(prisma, encodedSlug);

    if (sameSlugContent && sameSlugContent.id !== content.id) {
      throw new RecordNotUniqueException('already_registered_content_slug');
    }

    latestRevision.publish(userId);

    content.publish({
      slug: latestRevision.slug,
      title: latestRevision.title,
      subtitle: latestRevision.subtitle,
      body: latestRevision.body,
      bodyJson: latestRevision.bodyJson,
      bodyHtml: latestRevision.bodyHtml,
      metaTitle: latestRevision.metaTitle,
      metaDescription: latestRevision.metaDescription,
      coverUrl: latestRevision.coverUrl,
      currentVersion: latestRevision.version,
      updatedById: userId,
    });

    const updatedContent = await this.contentRepository.update(prisma, content);
    await this.contentRevisionRepository.update(prisma, latestRevision);

    return updatedContent;
  }
}
