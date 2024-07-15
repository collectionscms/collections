import { Content } from '@prisma/client';
import { ContentRepository } from '../../data/content/content.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { TrashPostUseCaseSchemaType } from './trashPost.schema.js';

export class TrashPostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute({ id }: TrashPostUseCaseSchemaType): Promise<Content[]> {
    const contents = await this.contentRepository.findManyByPostId(this.prisma, id);

    await this.prisma.$transaction(async (tx) => {
      for (const content of contents) {
        content.delete();
        await this.contentRepository.updateStatus(tx, content);
      }
    });

    return contents.map((content) => content.toResponse());
  }
}
