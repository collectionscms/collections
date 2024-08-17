import { PostItem } from '../../../types/index.js';
import { PostRepository } from '../../persistences/post/post.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { GetPostsUseCaseSchemaType } from './getPosts.schema.js';

export class GetPostsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly postRepository: PostRepository
  ) {}

  async execute(props: GetPostsUseCaseSchemaType, hasReadAllPost: boolean): Promise<PostItem[]> {
    const options = hasReadAllPost ? undefined : { userId: props.userId };
    const records = await this.postRepository.findMany(this.prisma, options);

    return records.map((record) => {
      return record.post.toPostItemResponse(props.sourceLanguage, record.contents);
    });
  }
}
