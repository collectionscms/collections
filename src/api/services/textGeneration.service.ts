import { Translator } from '@collectionscms/plugin-text-generator';
import { LanguageCode } from '../../constants/languages.js';

export class TextGenerationService {
  constructor(private readonly translator: Translator) {}

  async translateToEnglish(
    text: string,
    sourceLanguage: LanguageCode,
    targetLanguage: LanguageCode
  ): Promise<{
    englishText: string;
    isTranslated: boolean;
  }> {
    if (
      sourceLanguage.sourceLanguageCode !== 'en' &&
      sourceLanguage.sourceLanguageCode &&
      targetLanguage.targetLanguageCode
    ) {
      // Translate the body to English
      const translatedBody = await this.translator.translate(
        [text],
        sourceLanguage.sourceLanguageCode,
        targetLanguage.targetLanguageCode
      );
      return {
        englishText: translatedBody[0].text,
        isTranslated: true,
      };
    }

    return {
      englishText: text,
      isTranslated: false,
    };
  }
}
