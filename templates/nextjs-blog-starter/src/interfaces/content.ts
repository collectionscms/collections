import { Author } from './author';

export type Content = {
  slug: string;
  title: string;
  subtitle: string | null;
  body: string;
  bodyHtml: string;
  language: string;
  coverUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string;
  author: Author;
};
