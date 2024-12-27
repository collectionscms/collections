import { Content } from '@prisma/client';
import { v4 } from 'uuid';
import { IsoLanguageCode } from '../../../constants/languages.js';
import { generateKey } from '../../utilities/generateKey.js';
import { ContentEntity, ContentStatus } from './content.entity.js';

const defaultValue = {
  id: v4(),
  projectId: v4(),
  postId: v4(),
  slug: 'slug',
  title: 'title',
  subtitle: 'subtitle',
  body: 'body',
  bodyJson: 'bodyJson',
  bodyHtml: 'bodyHtml',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  coverUrl: 'coverUrl',
  language: IsoLanguageCode['en-us'],
  status: ContentStatus.published,
  currentVersion: 1,
  draftKey: generateKey(),
  publishedAt: new Date(),
  deletedAt: null,
  createdById: v4(),
  updatedById: v4(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buildContentEntity = <K extends keyof Content>(props?: {
  [key in K]: Content[key];
}): ContentEntity => {
  return ContentEntity.Reconstruct<Content, ContentEntity>({
    ...defaultValue,
    ...props,
  });
};
