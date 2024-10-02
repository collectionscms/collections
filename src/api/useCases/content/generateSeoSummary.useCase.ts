import { TextGenerator, Translator } from '@collectionscms/plugin-text-generator';
import { getLanguageCodeType } from '../../../constants/languages.js';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ForbiddenException } from '../../../exceptions/forbidden.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { TextGenerationUsageEntity } from '../../persistence/textGenerationUsage/textGenerationUsage.entity.js';
import { TextGenerationUsageRepository } from '../../persistence/textGenerationUsage/textGenerationUsage.repository.js';
import { GenerateSeoSummaryUseCaseSchemaType } from './generateSeoSummary.useCase.schema.js';

export class GenerateSeoSummaryUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly textGenerationUsageRepository: TextGenerationUsageRepository,
    private readonly translator: Translator,
    private readonly textGenerator: TextGenerator
  ) {}

  async execute({
    id,
    userId,
  }: GenerateSeoSummaryUseCaseSchemaType): Promise<{ metaTitle: string; metaDescription: string }> {
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

    // Check if the latest usage is not generated
    const latestUsage = await this.textGenerationUsageRepository.findLatestOneByContentId(
      this.prisma,
      content.id
    );
    if (latestUsage && !latestUsage.isGenerate()) {
      throw new ForbiddenException('unable_to_repeat');
    }

    const usages: TextGenerationUsageEntity[] = [];

    let body = latestRevision.body;
    if (
      sourceLanguage.sourceLanguageCode !== 'en' &&
      sourceLanguage.sourceLanguageCode &&
      targetLanguage.targetLanguageCode
    ) {
      // Translate the body to English
      const translatedBody = await this.translator.translate(
        [latestRevision.body],
        sourceLanguage.sourceLanguageCode,
        targetLanguage.targetLanguageCode
      );
      body = translatedBody[0].text;

      usages.push(
        TextGenerationUsageEntity.Construct({
          projectId: content.projectId,
          contentId: content.id,
          userId,
          sourceText: latestRevision.body,
          generatedText: translatedBody,
          context: 'translated for summary',
        })
      );
    }

    // Summarize the body
    const summarizedSeo = await this.textGenerator.summarizeSeo(body, sourceLanguage.englishName);
    if (summarizedSeo.title && summarizedSeo.description) {
      latestRevision.updateContent({
        metaTitle: summarizedSeo.title,
        metaDescription: summarizedSeo.description,
        updatedById: userId,
      });
    }

    usages.push(
      TextGenerationUsageEntity.Construct({
        projectId: content.projectId,
        contentId: content.id,
        userId,
        sourceText: latestRevision.body,
        generatedText: summarizedSeo,
        context: 'summary for seo',
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

    return { metaTitle: summarizedSeo.title, metaDescription: summarizedSeo.description };
  }
}
