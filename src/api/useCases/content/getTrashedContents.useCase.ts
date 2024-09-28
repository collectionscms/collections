import { Content } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';

export class GetTrashedContentsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly contentRevisionRepository: ContentRevisionRepository
  ) {}

  async execute(): Promise<Content[]> {
    const records = await this.contentRevisionRepository.findManyTrashed(this.prisma);

    return records.map((revision) => {
      return revision.toContentResponse();
    });
  }
}
