import { Translator } from '@collectionscms/plugin-text-generator';
import { getLanguageCodeType } from '../../../constants/languages.js';
import { InvalidPayloadException } from '../../../exceptions/invalidPayload.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { TextGenerationUsageEntity } from '../../persistence/textGenerationUsage/textGenerationUsage.entity.js';
import { TextGenerationUsageRepository } from '../../persistence/textGenerationUsage/textGenerationUsage.repository.js';
import { TranslateContentUseCaseSchemaType } from './translateContent.useCase.schema.js';

type TranslateContentResponse = {
  title: string;
  body: string;
};

export class TranslateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly textGenerationUsageRepository: TextGenerationUsageRepository,
    private readonly translator: Translator
  ) {}

  async execute(props: TranslateContentUseCaseSchemaType): Promise<TranslateContentResponse> {
    const { id, userId, sourceLanguage, targetLanguage } = props;

    const sourceLanguageCode = getLanguageCodeType(sourceLanguage);
    const targetLanguageCode = getLanguageCodeType(targetLanguage);

    if (!sourceLanguageCode?.sourceLanguageCode || !targetLanguageCode?.targetLanguageCode) {
      throw new InvalidPayloadException('bad_request');
    }

    const sourceLngRevision = await this.contentRevisionRepository.findOneByPostIdAndLanguage(
      this.prisma,
      id,
      sourceLanguageCode.code
    );

    if (!sourceLngRevision) {
      return { title: '', body: '' };
    }

    const textResults = await this.translator.translate(
      [sourceLngRevision.title, sourceLngRevision.bodyHtml],
      sourceLanguageCode.sourceLanguageCode,
      targetLanguageCode.targetLanguageCode
    );

    const usage = TextGenerationUsageEntity.Construct({
      projectId: sourceLngRevision.projectId,
      contentId: sourceLngRevision.contentId,
      userId,
      sourceText: {
        title: sourceLngRevision.title,
        body: sourceLngRevision.bodyHtml,
      },
      generatedText: textResults,
      context: 'translate',
    });
    this.textGenerationUsageRepository.create(this.prisma, usage);

    return {
      title: textResults[0].text,
      body: textResults[textResults.length - 1].text,
    };
  }
}
