import { LocalizedPost } from '../../../types/index.js';
import { PostRepository } from '../../persistence/post/post.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { GetPostUseCaseSchemaType } from './getPost.schema.js';
import { ProjectRepository } from '../../persistence/project/project.repository.js';

export class GetPostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly projectRepository: ProjectRepository,
    private readonly postRepository: PostRepository
  ) {}

  async execute(props: GetPostUseCaseSchemaType, hasReadAllPost: boolean): Promise<LocalizedPost> {
    const project = await this.projectRepository.findOneById(this.prisma, props.projectId);

    const options = hasReadAllPost ? undefined : { userId: props.userId };
    const record = await this.postRepository.findOneWithContentsById(
      this.prisma,
      props.postId,
      options
    );

    return record.post.toLocalizedWithContentsResponse(props.language, project, record.contents);
  }
}
