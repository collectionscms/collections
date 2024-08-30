import { getLanguageCodeType } from '../../../constants/languages.js';
import { env } from '../../../env.js';
import { InvalidPayloadException } from '../../../exceptions/invalidPayload.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { Translator } from '../../integrations/translator.js';
import { ContentRepository } from '../../persistence/content/content.repository.js';
import { TranslateContentUseCaseSchemaType } from './translateContent.schema.js';

type TranslateContentResponse = {
  title: string;
  body: string;
};

export class TranslateContentUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly contentRepository: ContentRepository,
    private readonly translator: Translator
  ) {}

  async execute(props: TranslateContentUseCaseSchemaType): Promise<TranslateContentResponse> {
    const { id, sourceLanguage, targetLanguage } = props;

    const sourceLanguageCode = getLanguageCodeType(sourceLanguage);
    const targetLanguageCode = getLanguageCodeType(targetLanguage);

    if (!sourceLanguageCode?.sourceLanguageCode || !targetLanguageCode?.targetLanguageCode) {
      throw new InvalidPayloadException('bad_request');
    }

    const sourceLngContents = await this.contentRepository.findManyByPostIdAndLanguage(
      this.prisma,
      id,
      sourceLanguageCode.code
    );
    const title = sourceLngContents[0].title;
    const body = sourceLngContents[0].bodyHtml.slice(0, env.MAX_TRANSLATION_LENGTH);

    const texts = [title, body].filter((text) => text.length > 0);
    if (texts.length === 0) {
      return { title: '', body: '' };
    }

    const textResults = await this.translator.translate(
      texts,
      sourceLanguageCode.sourceLanguageCode,
      targetLanguageCode.targetLanguageCode
    );

    return {
      title: title.length > 0 ? textResults[0].text : '',
      body: body.length > 0 ? textResults[textResults.length - 1].text : '',
    };
  }
}
