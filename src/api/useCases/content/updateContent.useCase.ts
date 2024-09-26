import { Content } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentEntity } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { UpdateContentUseCaseSchemaType } from './updateContent.useCase.schema.js';

export class UpdateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository
  ) {}

  async execute(props: UpdateContentUseCaseSchemaType): Promise<Content> {
    const revision = await this.contentRevisionRepository.findLatestOneByContentId(
      this.prisma,
      props.id
    );

    if (!revision) {
      throw new RecordNotFoundException('record_not_found');
    }

    if (props.slug) {
      const encodedSlug = encodeURIComponent(props.slug);
      const sameSlugContent = await this.contentRepository.findOneBySlug(this.prisma, encodedSlug);

      if (sameSlugContent?.content && sameSlugContent?.content.id !== props.id) {
        throw new RecordNotUniqueException('already_registered_post_slug');
      }
    }

    const createdOrUpdatedRevision = await this.prisma.$transaction(async (tx) => {
      if (revision.isPublished()) {
        // create new version content
        const { content, contentRevision } = ContentEntity.Construct({
          ...revision.toResponse(),
          coverUrl: props.coverUrl,
          title: props.title,
          body: props.body,
          bodyJson: props.bodyJson,
          bodyHtml: props.bodyHtml,
          slug: props.slug,
          excerpt: props.excerpt || null,
          metaTitle: props.metaTitle || null,
          metaDescription: props.metaDescription || null,
          createdById: props.userId,
          currentVersion: revision.version + 1,
        });

        await this.contentRepository.create(tx, content);
        return await this.contentRevisionRepository.create(tx, contentRevision);
      } else {
        // update current revision
        revision.updateContent({
          coverUrl: props.coverUrl,
          title: props.title,
          body: props.body,
          bodyJson: props.bodyJson,
          bodyHtml: props.bodyHtml,
          slug: props.slug,
          updatedById: props.userId,
          excerpt: props.excerpt || null,
          metaTitle: props.metaTitle || null,
          metaDescription: props.metaDescription || null,
        });
        return await this.contentRevisionRepository.update(tx, revision);
      }
    });

    return createdOrUpdatedRevision.toContentResponse();
  }
}
