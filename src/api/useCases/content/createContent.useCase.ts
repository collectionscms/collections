import { Content } from '@prisma/client';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentEntity } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { CreateContentUseCaseSchemaType } from './createContent.useCase.schema.js';

export class CreateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository
  ) {}

  async execute(props: CreateContentUseCaseSchemaType): Promise<Content> {
    const { content, contentRevision } = ContentEntity.Construct({
      projectId: props.projectId,
      postId: props.id,
      language: props.language,
      slug: ContentEntity.generateSlug(),
      createdById: props.userId,
      currentVersion: 1,
    });

    const createdContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.create(tx, content);
      await this.contentRevisionRepository.create(tx, contentRevision);

      return result;
    });

    return createdContent.content.toResponse();
  }
}
