import { Content } from '@prisma/client';
import { ContentEntity } from '../../persistence/content/content.entity.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { CreateContentUseCaseSchemaType } from './createContent.useCase.schema.js';

export class CreateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository
  ) {}

  async execute(props: CreateContentUseCaseSchemaType): Promise<Content> {
    const entity = ContentEntity.Construct({
      projectId: props.projectId,
      postId: props.id,
      language: props.language,
      slug: ContentEntity.generateSlug(),
      createdById: props.userId,
    });

    const createdContent = await this.prisma.$transaction(async (tx) => {
      const result = await this.contentRepository.create(tx, entity);

      const contentRevision = ContentRevisionEntity.Construct({
        ...result.content.toResponse(),
      });
      await this.contentRevisionRepository.create(tx, contentRevision);

      return result;
    });

    return createdContent.content.toResponse();
  }
}
