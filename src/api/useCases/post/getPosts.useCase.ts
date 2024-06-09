import { LocalizedPost } from '../../../types/index.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { GetPostsUseCaseSchemaType } from './getPosts.schema.js';

export class GetPostsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly postRepository: PostRepository
  ) {}

  async execute(props: GetPostsUseCaseSchemaType): Promise<LocalizedPost[]> {
    const records = await this.postRepository.findManyByProjectId(this.prisma);

    return records.map((record) => {
      return record.post.toLocalizedWithContentsResponse(
        props.locale,
        record.contents,
        record.histories
      );
    });
  }
}
