import { PostItem } from '../../../types/index.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { GetPostsUseCaseSchemaType } from './getPosts.schema.js';

export class GetPostsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly postRepository: PostRepository
  ) {}

  async execute(props: GetPostsUseCaseSchemaType): Promise<PostItem[]> {
    const records = await this.postRepository.findManyByProjectId(this.prisma);

    return records.map((record) => {
      return record.post.toPostItemResponse(props.primaryLocale, record.contents);
    });
  }
}
