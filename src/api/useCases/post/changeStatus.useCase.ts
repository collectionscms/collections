import { Post } from '@prisma/client';
import { ContentRepository } from '../../data/content/content.repository.js';
import { PostRepository } from '../../data/post/post.repository.js';

import { PostHistoryRepository } from '../../data/postHistory/postHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ChangeStatusUseCaseSchemaType } from './changeStatus.schema.js';

export class ChangeStatusUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository,
    private readonly postHistoryRepository: PostHistoryRepository,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute(props: ChangeStatusUseCaseSchemaType): Promise<Post> {
    const { projectId, id, userId, status } = props;
    const { post, contents } = await this.postRepository.findOneWithContentsById(this.prisma, id);

    await this.prisma.$transaction(async (tx) => {
      for (const c of contents) {
        const content = c.content;
        content.changeStatus(status);
        await this.contentRepository.updateStatus(tx, content);
      }

      // const postHistoryEntity = PostHistoryEntity.Construct({
      //   projectId: projectId,
      //   postId: id,
      //   userId,
      //   status,
      //   version: updatedPost.version,
      // });
      // await this.postHistoryRepository.create(tx, postHistoryEntity);
    });

    return post.toResponse();
  }
}
