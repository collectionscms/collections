import { LocalizedPost } from '../../../types/index.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { PostEntity } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { CreatePostUseCaseSchemaType } from './createPost.schema.js';

export class CreatePostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute(props: CreatePostUseCaseSchemaType): Promise<LocalizedPost> {
    const { userId, projectId, locale } = props;

    const { post, content } = PostEntity.Construct({
      projectId: projectId,
      defaultLocale: locale,
      createdById: userId,
    });

    const record = await this.prisma.$transaction(async (tx) => {
      const createdPost = await this.postRepository.create(tx, post);
      const { content: createdContent, createdBy } = await this.contentRepository.create(
        tx,
        content
      );

      // const postHistoryEntity = PostHistoryEntity.Construct({
      //   projectId: projectId,
      //   postId: post.id,
      //   userId,
      //   status: 'draft',
      //   version: post.version,
      // });
      // await this.postHistoryRepository.create(tx, postHistoryEntity);

      return {
        post: createdPost,
        contents: [
          {
            content: createdContent,
            file: null,
            createdBy: createdBy,
          },
        ],
      };
    });

    return record.post.toLocalizedWithContentsResponse(locale, record.contents, []);
  }
}
