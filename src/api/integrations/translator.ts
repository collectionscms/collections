import * as deepl from 'deepl-node';

export class Translator {
  translator: deepl.Translator;

  constructor(authKey: string) {
    this.translator = new deepl.Translator(authKey);
  }

  async translate(
    text: string,
    sourceLang: deepl.SourceLanguageCode | null,
    targetLang: deepl.TargetLanguageCode
  ) {
    let textResult = await this.translator.translateText(text, sourceLang, targetLang, {
      preserveFormatting: true,
    });

    return textResult;
  }
}
