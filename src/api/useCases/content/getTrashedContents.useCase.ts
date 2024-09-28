import { Content } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';

export class GetTrashedContentsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute(): Promise<Content[]> {
    const records = await this.contentRepository.findManyTrashedWithRevisions(this.prisma);

    const contents = records.map(({ content, revisions }) => {
      const latestRevision = ContentRevisionEntity.getLatestRevisionOfLanguage(
        revisions,
        content.language
      );

      return latestRevision.toContentResponse();
    });

    return contents;
  }
}
