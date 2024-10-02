import { Translator } from '@collectionscms/plugin-text-generator';
import { getLanguageCodeType } from '../../../constants/languages.js';
import { InvalidPayloadException } from '../../../exceptions/invalidPayload.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ContentRevisionRepository } from '../../persistence/contentRevision/contentRevision.repository.js';
import { TranslateContentUseCaseSchemaType } from './translateContent.useCase.schema.js';

type TranslateContentResponse = {
  title: string;
  body: string;
};

export class TranslateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRevisionRepository: ContentRevisionRepository,
    private readonly translator: Translator
  ) {}

  async execute(props: TranslateContentUseCaseSchemaType): Promise<TranslateContentResponse> {
    const { id, sourceLanguage, targetLanguage } = props;

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

    const title = sourceLngRevision?.title ?? '';
    const body = sourceLngRevision?.bodyHtml ?? '';

    if (!title && !body) {
      return { title: '', body: '' };
    }

    const textResults = await this.translator.translate(
      [title, body],
      sourceLanguageCode.sourceLanguageCode,
      targetLanguageCode.targetLanguageCode
    );

    return {
      title: title.length > 0 ? textResults[0].text : '',
      body: body.length > 0 ? textResults[textResults.length - 1].text : '',
    };
  }
}
