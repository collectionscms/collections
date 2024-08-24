import { LocalizedPost } from '../../../types/index.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentHistoryEntity } from '../../persistence/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../persistence/contentHistory/contentHistory.repository.js';
import { PostEntity } from '../../persistence/post/post.entity.js';
import { PostRepository } from '../../persistence/post/post.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { CreatePostUseCaseSchemaType } from './createPost.schema.js';

export class CreatePostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute(props: CreatePostUseCaseSchemaType): Promise<LocalizedPost> {
    const { userId, projectId, sourceLanguage } = props;

    const { post, content } = PostEntity.Construct({
      projectId: projectId,
      language: sourceLanguage,
      createdById: userId,
    });

    const result = await this.prisma.$transaction(async (tx) => {
      const createdPost = await this.postRepository.create(tx, post);
      const { content: createdContent, createdBy } = await this.contentRepository.create(
        tx,
        content
      );

      const contentHistory = ContentHistoryEntity.Construct({
        ...createdContent.toResponse(),
      });
      await this.contentHistoryRepository.create(tx, contentHistory);

      return {
        post: createdPost,
        contents: [
          {
            content: createdContent,
            file: null,
            createdBy: createdBy,
            histories: [contentHistory],
          },
        ],
      };
    });

    return result.post.toLocalizedWithContentsResponse(sourceLanguage, result.contents);
  }
}
