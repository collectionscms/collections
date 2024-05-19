import { Content, Post } from '@prisma/client';
import { ContentEntity } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { PostEntity } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { PostHistoryEntity } from '../../data/postHistory/postHistory.entity.js';
import { PostHistoryRepository } from '../../data/postHistory/postHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { UpdateContentUseCaseSchemaType } from './updateContent.schema.js';

export class UpdateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository,
    private readonly contentRepository: ContentRepository,
    private readonly postHistoryRepository: PostHistoryRepository
  ) {}

  async execute(props: UpdateContentUseCaseSchemaType): Promise<Content> {
    const { id, projectId, userId, fileId, title, body, bodyJson, bodyHtml } = props;

    const record = await this.contentRepository.findOneById(this.prisma, id, projectId);
    const post = await this.postRepository.findOneById(
      this.prisma,
      record.projectId,
      record.postId
    );

    const result = await this.prisma.$transaction(async (tx) => {
      if (post.status === 'init') {
        const entity = PostEntity.Reconstruct<Post, PostEntity>(post.toPersistence());
        entity.updateStatus('draft');
        await this.postRepository.update(tx, projectId, entity);

        await this.postHistoryRepository.create(
          tx,
          PostHistoryEntity.Construct({
            projectId: post.projectId,
            postId: post.id,
            userId,
            status: 'draft',
            version: post.version,
          })
        );
      }

      const entity = ContentEntity.Reconstruct<Content, ContentEntity>(record.toPersistence());
      entity.updateContent({
        fileId,
        title,
        body,
        bodyJson,
        bodyHtml,
      });

      return await this.contentRepository.update(this.prisma, entity);
    });

    return result.toResponse();
  }
}
