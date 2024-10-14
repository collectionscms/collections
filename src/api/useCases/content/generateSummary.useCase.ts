import { TextGenerator, Translator } from '@collectionscms/plugin-text-generator';
import { getLanguageCodeType } from '../../../constants/languages.js';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { ContentRevisionEntity } from '../../persistence/contentRevision/contentRevision.entity.js';
import { TextGenerationUsageEntity } from '../../persistence/textGenerationUsage/textGenerationUsage.entity.js';
import { TextGenerationUsageRepository } from '../../persistence/textGenerationUsage/textGenerationUsage.repository.js';
import { GenerateSeoUseCaseSchemaType } from './generateSeo.useCase.schema.js';

export class GenerateSummaryUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly textGenerationUsageRepository: TextGenerationUsageRepository,
    private readonly translator: Translator,
    private readonly textGenerator: TextGenerator
  ) {}

  async execute({ id, userId }: GenerateSeoUseCaseSchemaType): Promise<{ body: string }> {
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
          context: 'translate for summary',
        })
      );
    }

    // Generate summary
    const summaries = await this.textGenerator.generateSummary(body, sourceLanguage.englishName);
    const summaryHtml = generateSummaryHtml(summaries);

    usages.push(
      TextGenerationUsageEntity.Construct({
        projectId: content.projectId,
        contentId: content.id,
        userId,
        sourceText: latestRevision.body,
        generatedText: summaries,
        context: 'generate for seo',
      })
    );
    await this.textGenerationUsageRepository.createMany(this.prisma, usages);

    return { body: summaryHtml };
  }
}

function generateSummaryHtml(summaries: { question: string; answer: string }[]): string {
  const items = summaries
    .map(
      (summary) => `<li><p>${summary.question}</p><ul><li><p>${summary.answer}</p></li></ul></li>`
    )
    .join('');
  return `<h2>Summary</h2><ul>${items}</ul>`;
}
