import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { PublishedPost } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { PostRepository } from '../../persistence/post/post.repository.js';
import { GetPublishedPostUseCaseSchemaType } from './getPublishedPost.useCase.schema.js';

export class GetPublishedPostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly postRepository: PostRepository
  ) {}

  async execute(props: GetPublishedPostUseCaseSchemaType): Promise<PublishedPost> {
    const record = await this.postRepository.findOnePublishedById(this.prisma, props.id);
    if (!record) {
      throw new RecordNotFoundException('record_not_found');
    }

    const post = record.post.toPublishedPostResponse(props.language ?? null, record.contents);
    if (!post) {
      throw new RecordNotFoundException('record_not_found');
    }

    return post;
  }
}
