import { Post } from '@prisma/client';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import { PostRepository } from '../../persistences/post/post.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { UpdatePostUseCaseSchemaType } from './updatePost.schema.js';

export class UpdatePostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository
  ) {}

  async execute({ postId, slug }: UpdatePostUseCaseSchemaType): Promise<Post> {
    const sameSlugPost = await this.postRepository.findOneBySlug(this.prisma, slug);
    if (sameSlugPost && sameSlugPost.id !== postId) {
      throw new RecordNotUniqueException('already_registered_post_slug');
    }

    const post = await this.postRepository.findOneById(this.prisma, postId);
    post.updatePost({ slug });
    post.beforeUpdateValidate();

    const result = await this.postRepository.updateSlug(this.prisma, post);

    return result.toResponse();
  }
}
