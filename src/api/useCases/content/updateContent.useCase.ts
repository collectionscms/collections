import { Content } from '@prisma/client';
import { ConflictException } from '../../../exceptions/conflict.js';
import { ContentEntity } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { ContentHistoryEntity } from '../../data/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../data/contentHistory/contentHistory.repository.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { UpdateContentUseCaseSchemaType } from './updateContent.schema.js';

export class UpdateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly postRepository: PostRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: UpdateContentUseCaseSchemaType): Promise<Content> {
    const { id, userId, fileId, title, body, bodyJson, bodyHtml } = props;

    const content = await this.contentRepository.findOneById(this.prisma, id);
    const post = await this.postRepository.findOneWithContentsById(this.prisma, content.postId);

    if (content.hasNewVersion(post.contents.map((c) => c.content))) {
      throw new ConflictException('already_updated_by_another_user');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      let entity = content.isPublished()
        ? ContentEntity.Construct({
            projectId: content.projectId,
            postId: content.postId,
            locale: content.locale,
            createdById: userId,
            version: content.version + 1,
          })
        : ContentEntity.Reconstruct<Content, ContentEntity>(content.toResponse());

      entity.updateContent({
        fileId,
        title,
        body,
        bodyJson,
        bodyHtml,
        updatedById: userId,
      });

      if (content.isPublished()) {
        // create new version content
        const createdContent = await this.contentRepository.create(this.prisma, entity);
        const history = ContentHistoryEntity.Construct({
          projectId: entity.projectId,
          contentId: entity.id,
          userId: entity.createdById,
          status: entity.status,
          version: entity.version,
        });
        await this.contentHistoryRepository.create(this.prisma, history);

        return createdContent.content;
      } else {
        // update current content
        const updatedContent = await this.contentRepository.update(this.prisma, entity);
        return updatedContent;
      }
    });

    return result.toResponse();
  }
}
