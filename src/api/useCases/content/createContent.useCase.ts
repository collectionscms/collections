import { Content } from '@prisma/client';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
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

  async execute({
    id,
    projectId,
    language,
    userId,
  }: CreateContentUseCaseSchemaType): Promise<Content> {
    const contents = await this.contentRepository.findWithDeletedByPostId(this.prisma, id);
    const languageContent = contents.find((c) => c.language === language);

    if (languageContent) {
      if (languageContent.deletedAt) {
        await this.contentRepository.delete(this.prisma, languageContent);
      } else {
        throw new RecordNotUniqueException('already_has_same_language_content');
      }
    }

    const { content, contentRevision } = ContentEntity.Construct({
      projectId: projectId,
      postId: id,
      language: language,
      slug: ContentEntity.generateSlug(),
      createdById: userId,
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
