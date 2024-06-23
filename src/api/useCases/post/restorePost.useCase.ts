import { Post } from '@prisma/client';
import { postStatus } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { RestorePostUseCaseSchemaType } from './restorePost.schema.js';

export class RestorePostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository
  ) {}

  async execute({ id }: RestorePostUseCaseSchemaType): Promise<Post> {
    const post = await this.postRepository.findOneById(this.prisma, id);
    post.changeStatus(postStatus.open);

    const result = await this.postRepository.updateStatus(this.prisma, post);
    return result.toResponse();
  }
}
