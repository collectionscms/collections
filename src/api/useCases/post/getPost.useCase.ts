import { LocalizedPost } from '../../../types/index.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { GetPostUseCaseSchemaType } from './getPost.schema.js';

export class GetPostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly postRepository: PostRepository
  ) {}

  async execute(props: GetPostUseCaseSchemaType, hasReadAllPost: boolean): Promise<LocalizedPost> {
    const options = hasReadAllPost ? undefined : { userId: props.userId };
    const record = await this.postRepository.findOneWithContentsById(
      this.prisma,
      props.postId,
      options
    );

    return record.post.toLocalizedWithContentsResponse(props.locale, record.contents);
  }
}
