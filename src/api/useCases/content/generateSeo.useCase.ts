import { TextGenerator } from '@collectionscms/plugin-text-generator';
import { getLanguageCodeType } from '../../../constants/languages.js';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { TextGenerationUsageEntity } from '../../persistence/textGenerationUsage/textGenerationUsage.entity.js';
import { TextGenerationUsageRepository } from '../../persistence/textGenerationUsage/textGenerationUsage.repository.js';
import { TextGenerationService } from '../../services/textGeneration.service.js';
import { GenerateSeoUseCaseSchemaType } from './generateSeo.useCase.schema.js';

export class GenerateSeoUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly textGenerationUsageRepository: TextGenerationUsageRepository,
    private readonly textGenerationService: TextGenerationService,
    private readonly textGenerator: TextGenerator
  ) {}

  async execute({
    id,
    userId,
  }: GenerateSeoUseCaseSchemaType): Promise<{ metaTitle: string; metaDescription: string }> {
    const contentWithRevisions = await this.contentRepository.findOneWithRevisionsById(
      this.prisma,
      id
    );

    if (!contentWithRevisions) {
      throw new RecordNotFoundException('record_not_found');
    }

    const { content, revisions } = contentWithRevisions;

    const sourceLanguage = content?.languageCode;
    const targetLanguage = getLanguageCodeType('en-us');

    if (!sourceLanguage || !targetLanguage) {
      throw new RecordNotFoundException('record_not_found');
    }

    const latestRevision = ContentRevisionEntity.getLatestRevisionOfLanguage(
      revisions,
      content.language
    );

    // Text to English
    const { englishText, isTranslated } =
      await this.textGenerationService.translateToEnglishIfNeeded(
        latestRevision.body,
        sourceLanguage,
        targetLanguage
      );

    const usages = isTranslated
      ? [
          TextGenerationUsageEntity.Construct({
            projectId: content.projectId,
            contentId: content.id,
            userId,
            sourceText: latestRevision.body,
            generatedText: englishText,
            context: 'translate for seo',
          }),
        ]
      : [];

    // Generate seo
    const seo = await this.textGenerator.generateSeo(englishText, sourceLanguage.englishName);
    if (seo.title && seo.description) {
      latestRevision.updateContent({
        metaTitle: seo.title,
        metaDescription: seo.description,
        updatedById: userId,
      });
    }

    usages.push(
      TextGenerationUsageEntity.Construct({
        projectId: content.projectId,
        contentId: content.id,
        userId,
        sourceText: latestRevision.body,
        generatedText: seo,
        context: 'generate for seo',
      })
    );

    await this.prisma.$transaction(async (tx) => {
      if (latestRevision.isPublished()) {
        // create new version revision
        const contentRevision = ContentRevisionEntity.Construct({
          ...latestRevision.toResponse(),
          version: latestRevision.version + 1,
        });
        await this.contentRevisionRepository.create(tx, contentRevision);
      } else {
        // update current revision
        await this.contentRevisionRepository.update(tx, latestRevision);
      }

      await this.textGenerationUsageRepository.createMany(tx, usages);
    });

    return { metaTitle: seo.title, metaDescription: seo.description };
  }
}
