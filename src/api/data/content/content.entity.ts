import { Content } from '@prisma/client';
import { v4 } from 'uuid';

export class ContentEntity {
  private readonly content: Content;

  constructor(content: Content) {
    this.content = content;
  }

  static Construct({
    projectId,
    postId,
    locale,
  }: {
    projectId: string;
    postId: string;
    locale: string;
  }): ContentEntity {
    return new ContentEntity({
      id: v4(),
      projectId,
      postId,
      title: null,
      body: null,
      bodyJson: null,
      bodyHtml: null,
      locale,
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static Reconstruct(content: Content): ContentEntity {
    return new ContentEntity(content);
  }

  id(): string {
    return this.content.id;
  }

  projectId(): string {
    return this.content.projectId;
  }

  postId(): string {
    return this.content.postId;
  }

  title(): string {
    return this.content.title ?? '';
  }

  body(): string {
    return this.content.body ?? '';
  }

  bodyJson(): string {
    return this.content.bodyJson ?? '';
  }

  bodyHtml(): string {
    return this.content.bodyHtml ?? '';
  }

  locale(): string {
    return this.content.locale;
  }

  private copyProps(): Content {
    const copy = {
      ...this.content,
    };
    return Object.freeze(copy);
  }

  isSameLocaleContent(locale: string) {
    return this.content.locale.toLocaleLowerCase() === locale.toLocaleLowerCase();
  }

  toPersistence(): Content {
    return this.copyProps();
  }
}
