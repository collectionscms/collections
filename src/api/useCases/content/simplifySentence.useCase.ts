import { TextGenerator } from '@collectionscms/plugin-text-generator';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { TextGenerationUsageEntity } from '../../persistence/textGenerationUsage/textGenerationUsage.entity.js';
import { TextGenerationUsageRepository } from '../../persistence/textGenerationUsage/textGenerationUsage.repository.js';
import { SimplifySentenceUseCaseSchemaType } from './simplifySentence.useCase.schema.js';

export class SimplifySentenceUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly textGenerationUsageRepository: TextGenerationUsageRepository,
    private readonly textGenerator: TextGenerator
  ) {}

  async execute({
    id,
    userId,
    text,
  }: SimplifySentenceUseCaseSchemaType): Promise<{ text: string }> {
    const content = await this.contentRepository.findOneById(this.prisma, id);
    if (!content || !content.languageCode) {
      throw new RecordNotFoundException('record_not_found');
    }

    const sourceLanguage = content.languageCode;
    const generatedText = await this.textGenerator.simplifySentence(
      text,
      sourceLanguage.englishName
    );

    await this.textGenerationUsageRepository.create(
      this.prisma,
      TextGenerationUsageEntity.Construct({
        projectId: content.projectId,
        contentId: content.id,
        userId,
        sourceText: text,
        generatedText,
        context: 'complete sentence',
      })
    );

    return { text: generatedText };
  }
}
