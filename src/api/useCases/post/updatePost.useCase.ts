import { Post } from '@prisma/client';
import { PostRepository } from '../../data/post/post.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { UpdatePostUseCaseSchemaType } from './updatePost.schema.js';

export class UpdatePostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository
  ) {}

  async execute({ postId, slug }: UpdatePostUseCaseSchemaType): Promise<Post> {
    const post = await this.postRepository.findOneById(this.prisma, postId);
    post.updatePost({ slug });

    post.beforeUpdateValidate();
    const result = await this.postRepository.updateSlug(this.prisma, post);

    return result.toResponse();
  }
}
