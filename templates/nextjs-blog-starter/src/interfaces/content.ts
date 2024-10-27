import { Author } from "./author";

export type Content = {
  slug: string;
  title: string;
  subtitle: string;
  body: string;
  bodyHtml: string;
  coverUrl: string | null;
  publishedAt: string;
  author: Author;
};
