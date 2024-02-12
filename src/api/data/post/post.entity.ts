import { Content, Post } from '@prisma/client';
import { ContentEntity } from '../content/content.entity.js';

export class PostEntity {
  private readonly post: Post;

  constructor(post: Post) {
    this.post = post;
  }

  static Reconstruct(post: Post): PostEntity {
    return new PostEntity(post);
  }

  private copyProps(): Post {
    const copy = {
      ...this.post,
    };
    return Object.freeze(copy);
  }

  toPersistence(): Post {
    return this.copyProps();
  }

  toLocalize(
    locale: string,
    contents: ContentEntity[]
  ): {
    id: string;
    slug: string;
    status: string;
    updatedAt: Date;
    publishedAt: Date | null;
    defaultLocale: string;
    title: string;
    body: string;
    bodyJson: string;
    bodyHtml: string;
    locale: string;
    contents: Content[];
  } {
    const localizedContent = contents.find((content) => content.isSameLocaleContent(locale));

    return {
      id: this.post.id,
      slug: this.post.slug,
      status: this.post.status,
      updatedAt: this.post.updatedAt,
      publishedAt: this.post.publishedAt,
      defaultLocale: this.post.defaultLocale,
      title: localizedContent?.title() ?? '',
      body: localizedContent?.body() ?? '',
      bodyJson: localizedContent?.bodyJson() ?? '',
      bodyHtml: localizedContent?.bodyHtml() ?? '',
      locale: localizedContent?.locale() ?? '',
      contents: contents.map((content) => content.toPersistence()),
    };
  }
}
