import { SpokenLanguage } from '@prisma/client';
import { v4 } from 'uuid';
import { SpokenLanguageEntity } from './spokenLanguage.entity.js';

const defaultValue = {
  id: v4(),
  userId: v4(),
  language: 'English',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buildSpokenLanguageEntity = <K extends keyof SpokenLanguage>(props?: {
  [key in K]: SpokenLanguage[key];
}): SpokenLanguageEntity => {
  return SpokenLanguageEntity.Reconstruct<SpokenLanguage, SpokenLanguageEntity>({
    ...defaultValue,
    ...props,
  });
};
