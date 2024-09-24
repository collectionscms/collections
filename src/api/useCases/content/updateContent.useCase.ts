import { Content } from '@prisma/client';
import { ConflictException } from '../../../exceptions/conflict.js';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentEntity } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentHistoryEntity } from '../../persistence/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../persistence/contentHistory/contentHistory.repository.js';
import { PostRepository } from '../../persistence/post/post.repository.js';
import { UpdateContentUseCaseSchemaType } from './updateContent.useCase.schema.js';

export class UpdateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly postRepository: PostRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: UpdateContentUseCaseSchemaType): Promise<Content> {
    const { id, userId, slug } = props;

    const { content } = await this.contentRepository.findOneById(this.prisma, id);
    const post = await this.postRepository.findOneWithContentsById(this.prisma, content.postId);

    if (content.hasNewVersion(post.contents.map((c) => c.content))) {
      throw new ConflictException('already_updated_by_another_user');
    }

    if (slug) {
      const encodedSlug = encodeURIComponent(slug);
      const sameSlugContent = await this.contentRepository.findOneBySlug(this.prisma, encodedSlug);

      if (
        sameSlugContent?.content &&
        sameSlugContent?.content.id !== id &&
        // todo refactoring
        sameSlugContent?.content.postId !== post.post.id
      ) {
        throw new RecordNotUniqueException('already_registered_post_slug');
      }
    }

    const updatedContent = await this.prisma.$transaction(async (tx) => {
      let entity = content.isPublished()
        ? ContentEntity.Construct({
            ...content.toResponse(),
            createdById: userId,
            version: content.version + 1,
          })
        : ContentEntity.Reconstruct<Content, ContentEntity>(content.toResponse());

      entity.updateContent({
        coverUrl: props.coverUrl,
        title: props.title,
        body: props.body,
        bodyJson: props.bodyJson,
        bodyHtml: props.bodyHtml,
        slug: props.slug,
        updatedById: userId,
        excerpt: props.excerpt || null,
        metaTitle: props.metaTitle || null,
        metaDescription: props.metaDescription || null,
      });

      if (content.isPublished()) {
        // create new version content
        const createdContent = await this.contentRepository.create(tx, entity);
        const history = ContentHistoryEntity.Construct({
          ...entity.toResponse(),
        });
        await this.contentHistoryRepository.create(tx, history);

        return createdContent.content;
      } else {
        // update current content
        const updatedContent = await this.contentRepository.update(tx, entity);
        return updatedContent;
      }
    });

    return updatedContent.toResponse();
  }
}
