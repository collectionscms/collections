import * as deepl from 'deepl-node';

export class Translator {
  translator: deepl.Translator;

  constructor(authKey: string) {
    this.translator = new deepl.Translator(authKey);
  }

  async translate(
    texts: string[],
    sourceLang: deepl.SourceLanguageCode,
    targetLang: deepl.TargetLanguageCode
  ) {
    const textResults = await this.translator.translateText(texts, sourceLang, targetLang, {
      preserveFormatting: true,
    });

    return textResults;
  }
}
