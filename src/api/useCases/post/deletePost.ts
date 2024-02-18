import { PrismaClient } from '@prisma/client';
import { PostEntity } from '../../data/post/post.entity.js';
import { PostRepository } from '../../data/post/post.repository.js';

export class DeletePostUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly postRepository: PostRepository
  ) {}

  async execute(projectId: string, id: string): Promise<PostEntity> {
    const result = await this.prisma.$transaction(async (tx) => {
      const result = await this.postRepository.delete(tx, projectId, id);
      return result;
    });

    return result;
  }
}
