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
      fileId: null,
      title: null,
      body: null,
      bodyJson: null,
      bodyHtml: null,
      locale,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static Reconstruct(content: Content): ContentEntity {
    return new ContentEntity(content);
  }

  public beforeValidate(): void {}

  get id(): string {
    return this.content.id;
  }

  get projectId(): string {
    return this.content.projectId;
  }

  get postId(): string {
    return this.content.postId;
  }

  get title(): string {
    return this.content.title ?? '';
  }

  get body(): string {
    return this.content.body ?? '';
  }

  get bodyJson(): string {
    return this.content.bodyJson ?? '';
  }

  get bodyHtml(): string {
    return this.content.bodyHtml ?? '';
  }

  get locale(): string {
    return this.content.locale;
  }

  private copyProps(): Content {
    const copy = {
      ...this.content,
    };
    return Object.freeze(copy);
  }

  updateContent({
    title,
    body,
    bodyJson,
    bodyHtml,
    fileId,
  }: {
    title: string | null;
    body: string | null;
    bodyJson: string | null;
    bodyHtml: string | null;
    fileId: string | null;
  }): void {
    this.content.title = title;
    this.content.body = body;
    this.content.bodyJson = bodyJson;
    this.content.bodyHtml = bodyHtml;
    this.content.fileId = fileId;
  }

  isSameLocaleContent(locale: string) {
    return this.content.locale.toLocaleLowerCase() === locale.toLocaleLowerCase();
  }

  toPersistence(): Content {
    return this.copyProps();
  }

  toResponse(): Content {
    return this.copyProps();
  }
}
