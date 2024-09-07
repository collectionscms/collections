import { SourceLanguagePostItem } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { PostRepository } from '../../persistence/post/post.repository.js';
import { GetPostsUseCaseSchemaType } from './getPosts.schema.js';

export class GetPostsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly postRepository: PostRepository
  ) {}

  async execute(
    props: GetPostsUseCaseSchemaType,
    hasReadAllPost: boolean
  ): Promise<SourceLanguagePostItem[]> {
    const options = hasReadAllPost ? undefined : { userId: props.userId };
    const records = await this.postRepository.findMany(this.prisma, options);

    return records.map((record) => {
      return record.post.toSourceLanguagePostItemResponse(props.sourceLanguage, record.contents);
    });
  }
}
