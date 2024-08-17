import { PublishedPost } from '../../../types/index.js';
import { PostRepository } from '../../persistences/post/post.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { GetPublishedPostsUseCaseSchemaType } from './getPublishedPosts.schema.js';

export class GetPublishedPostsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly postRepository: PostRepository
  ) {}

  async execute(props: GetPublishedPostsUseCaseSchemaType): Promise<PublishedPost[]> {
    const records = await this.postRepository.findManyPublished(this.prisma);

    return records.map((record) => {
      return record.post.toPublishedWithContentsResponse(
        props.language ?? null,
        props.sourceLanguage,
        record.contents
      );
    });
  }
}
