import { LocalizedPost } from '../../../types/index.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { GetPostUseCaseSchemaType } from './getPost.schema.js';

export class GetPostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly postRepository: PostRepository
  ) {}

  async execute(props: GetPostUseCaseSchemaType): Promise<LocalizedPost> {
    const record = await this.postRepository.findOneWithContentsById(
      this.prisma,
      props.projectId,
      props.postId
    );

    return record.post.toLocalizedWithContentsResponse(
      props.locale,
      record.contents,
      record.histories
    );
  }
}
