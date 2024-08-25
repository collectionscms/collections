import { Content } from '@prisma/client';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class GetTrashedContentsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute(): Promise<Content[]> {
    const records = await this.contentRepository.findManyTrashed(this.prisma);
    return records.map((record) => record.toResponse());
  }
}
