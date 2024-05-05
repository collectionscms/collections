import { Post } from '@prisma/client';
import { PostRepository } from '../../data/post/post.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { DeletePostUseCaseSchemaType } from './deletePost.schema.js';

export class DeletePostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly postRepository: PostRepository
  ) {}

  async execute({ projectId, id }: DeletePostUseCaseSchemaType): Promise<Post> {
    const result = await this.prisma.$transaction(async (tx) => {
      const result = await this.postRepository.delete(tx, projectId, id);
      return result;
    });

    return result.toResponse();
  }
}
