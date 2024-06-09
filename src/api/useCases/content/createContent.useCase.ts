import { Content } from '@prisma/client';
import { ContentEntity } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { CreateContentUseCaseSchemaType } from './createContent.schema.js';

export class CreateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute(props: CreateContentUseCaseSchemaType): Promise<Content> {
    const entity = ContentEntity.Construct({
      projectId: props.projectId,
      postId: props.id,
      locale: props.locale,
      createdById: props.userId,
    });

    entity.beforeInsertValidate();
    const result = await this.contentRepository.create(this.prisma, entity);
    return result.content.toResponse();
  }
}
