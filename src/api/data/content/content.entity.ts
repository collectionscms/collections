import { Content } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class ContentEntity extends PrismaBaseEntity<Content> {
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

  get id(): string {
    return this.props.id;
  }

  get projectId(): string {
    return this.props.projectId;
  }

  get postId(): string {
    return this.props.postId;
  }

  get title(): string {
    return this.props.title ?? '';
  }

  get body(): string {
    return this.props.body ?? '';
  }

  get bodyJson(): string {
    return this.props.bodyJson ?? '';
  }

  get bodyHtml(): string {
    return this.props.bodyHtml ?? '';
  }

  get locale(): string {
    return this.props.locale;
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
    this.props.title = title;
    this.props.body = body;
    this.props.bodyJson = bodyJson;
    this.props.bodyHtml = bodyHtml;
    this.props.fileId = fileId;
  }

  isSameLocaleContent(locale: string) {
    return this.props.locale.toLocaleLowerCase() === locale.toLocaleLowerCase();
  }
}
