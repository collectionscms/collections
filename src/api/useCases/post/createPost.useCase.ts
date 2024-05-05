import { LocalizedPost } from '../../../types/index.js';
import { ContentEntity } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { FileEntity } from '../../data/file/file.entity.js';
import { PostEntity } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { UserEntity } from '../../data/user/user.entity.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { CreatePostUseCaseSchemaType } from './createPost.schema.js';

type CreatePostUseCaseResponse = {
  post: PostEntity;
  contents: {
    content: ContentEntity;
    file: FileEntity | null;
  }[];
  createdBy: UserEntity;
};

export class CreatePostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute(props: CreatePostUseCaseSchemaType): Promise<LocalizedPost> {
    const { userId, projectId, locale } = props;

    let record = await this.postRepository.findInitByUserId(this.prisma, userId);
    if (!record) {
      const { post, content } = PostEntity.Construct({
        projectId: projectId,
        defaultLocale: locale,
        createdById: userId,
      });

      record = await this.prisma.$transaction(async (tx) => {
        const result = await this.postRepository.create(tx, post);
        const contentEntity = await this.contentRepository.create(tx, content);

        return {
          post: result.post,
          contents: [
            {
              content: contentEntity,
              file: null,
            },
          ],
          createdBy: result.createdBy,
        };
      });
    }

    return record.post.toLocalizedWithContentsResponse(
      locale,
      record.contents,
      [],
      record.createdBy
    );
  }
}
