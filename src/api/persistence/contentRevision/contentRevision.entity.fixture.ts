import { ContentRevision } from '@prisma/client';
import { v4 } from 'uuid';
import { IsoLanguageCode } from '../../../constants/languages.js';
import { ContentStatus } from '../content/content.entity.js';
import { ContentRevisionEntity } from './contentRevision.entity.js';

const defaultValue = {
  id: v4(),
  projectId: v4(),
  postId: v4(),
  contentId: v4(),
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
  status: ContentStatus.draft,
  version: 1,
  draftKey: 'draftKey',
  publishedAt: null,
  deletedAt: null,
  createdById: v4(),
  updatedById: v4(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buildContentRevisionEntity = <K extends keyof ContentRevision>(props?: {
  [key in K]: ContentRevision[key];
}): ContentRevisionEntity => {
  return ContentRevisionEntity.Reconstruct<ContentRevision, ContentRevisionEntity>({
    ...defaultValue,
    ...props,
  });
};
