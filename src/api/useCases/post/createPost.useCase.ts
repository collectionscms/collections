import { PrismaClient } from '@prisma/client';
import { ContentEntity } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { PostEntity } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { PostHistoryRepository } from '../../data/postHistory/postHistory.repository.js';
import { UserEntity } from '../../data/user/user.entity.js';

type CreatePostUseCaseResponse = {
  post: PostEntity;
  contents: ContentEntity[];
  createdBy: UserEntity;
};

export class CreatePostUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly postRepository: PostRepository,
    private readonly contentRepository: ContentRepository,
    private readonly postHistoryRepository: PostHistoryRepository
  ) {}

  async execute(
    projectId: string,
    userId: string,
    locale: string
  ): Promise<CreatePostUseCaseResponse> {
    let record = await this.postRepository.findInitByUserId(this.prisma, projectId, userId);
    if (!record) {
      const { post, content } = PostEntity.Construct({
        projectId,
        defaultLocale: locale,
        createdById: userId,
      });

      record = await this.prisma.$transaction(async (tx) => {
        const result = await this.postRepository.create(tx, post);
        const contentEntity = await this.contentRepository.create(tx, content);

        return {
          post: result.post,
          contents: [contentEntity],
          createdBy: result.createdBy,
        };
      });
    }

    return record;
  }
}
