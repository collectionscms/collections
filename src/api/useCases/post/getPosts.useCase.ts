import { SourceLanguagePostItem } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { PostRepository } from '../../persistence/post/post.repository.js';
import { UserRepository } from '../../persistence/user/user.repository.js';
import { GetPostsUseCaseSchemaType } from './getPosts.useCase.schema.js';

export class GetPostsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    props: GetPostsUseCaseSchemaType,
    hasReadAllPost: boolean
  ): Promise<SourceLanguagePostItem[]> {
    const options = hasReadAllPost ? undefined : { userId: props.userId };
    const records = await this.postRepository.findMany(this.prisma, options);
    const users = await this.userRepository.findMany(this.prisma);

    return records.map((record) => {
      return record.post.toSourceLanguagePostItemResponse(
        props.sourceLanguage,
        record.contents,
        users
      );
    });
  }
}
