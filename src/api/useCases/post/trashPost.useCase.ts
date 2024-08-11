import { Content } from '@prisma/client';
import { ContentRepository } from '../../data/content/content.repository.js';
import { ContentHistoryEntity } from '../../data/contentHistory/contentHistory.entity.js';
import { ContentHistoryRepository } from '../../data/contentHistory/contentHistory.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { TrashPostUseCaseSchemaType } from './trashPost.schema.js';

export class TrashPostUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentHistoryRepository: ContentHistoryRepository
  ) {}

  async execute({ id, userId }: TrashPostUseCaseSchemaType): Promise<Content[]> {
    const contents = await this.contentRepository.findManyByPostId(this.prisma, id);

    await this.prisma.$transaction(async (tx) => {
      for (const content of contents) {
        content.delete(userId);
        await this.contentRepository.delete(tx, content);

        const contentHistory = ContentHistoryEntity.Construct({
          ...content.toResponse(),
        });
        await this.contentHistoryRepository.create(tx, contentHistory);
      }
    });

    return contents.map((content) => content.toResponse());
  }
}
