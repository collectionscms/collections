import { TranslationUsage } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class TranslationUsageEntity extends PrismaBaseEntity<TranslationUsage> {
  static Construct({
    projectId,
    userId,
    sourceLanguage,
    targetLanguage,
    sourceText,
    translatedText,
    characterCount,
  }: {
    projectId: string;
    userId: string;
    sourceLanguage: string;
    targetLanguage: string;
    sourceText: string;
    translatedText: string;
    characterCount: number;
  }): TranslationUsageEntity {
    return new TranslationUsageEntity({
      id: v4(),
      projectId,
      userId,
      sourceLanguage,
      targetLanguage,
      sourceText,
      translatedText,
      characterCount,
      createdAt: new Date(),
    });
  }

  private isValid() {
    if (!this.props.id) {
      throw new UnexpectedException({ message: 'id is required' });
    }
  }

  public beforeUpdateValidate(): void {
    this.isValid();
  }

  public beforeInsertValidate(): void {
    this.isValid();
  }
}
