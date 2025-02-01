import { SpokenLanguage } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class SpokenLanguageEntity extends PrismaBaseEntity<SpokenLanguage> {
  static Construct({
    userId,
    language,
  }: {
    userId: string;
    language: string;
  }): SpokenLanguageEntity {
    const now = new Date();
    return new SpokenLanguageEntity({
      id: v4(),
      userId,
      language,
      createdAt: now,
      updatedAt: now,
    });
  }
}
