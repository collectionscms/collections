import { PrismaClient } from '@prisma/client';
import { ContentEntity } from '../../data/content/content.entity.js';
import { ContentRepository } from '../../data/content/content.repository.js';

export class CreateContentUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly contentRepository: ContentRepository
  ) {}

  async execute(
    postId: string,
    projectId: string,
    params: { locale: string }
  ): Promise<ContentEntity> {
    const entity = ContentEntity.Construct({
      projectId,
      postId,
      locale: params.locale,
    });

    entity.beforeValidate();
    const result = await this.contentRepository.create(this.prisma, entity);
    return result;
  }
}
