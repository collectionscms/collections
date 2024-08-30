import { Content } from '@prisma/client';
import { v4 } from 'uuid';
import { getLanguageCodeType, LanguageCode } from '../../../constants/languages.js';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export const ContentStatus = {
  draft: 'draft',
  review: 'review',
  published: 'published',
  archived: 'archived',
} as const;
export type ContentStatusType = (typeof ContentStatus)[keyof typeof ContentStatus];

export class ContentEntity extends PrismaBaseEntity<Content> {
  static Construct({
    projectId,
    postId,
    language,
    createdById,
    version,
  }: {
    projectId: string;
    postId: string;
    language: string;
    createdById: string;
    version?: number;
  }): ContentEntity {
    return new ContentEntity({
      id: v4(),
      projectId,
      postId,
      coverUrl: null,
      title: null,
      body: null,
      bodyJson: null,
      bodyHtml: null,
      language,
      status: ContentStatus.draft,
      publishedAt: null,
      version: version || 1,
      createdById,
      updatedById: createdById,
      deletedAt: null,
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

  get coverUrl(): string {
    return this.props.coverUrl ?? '';
  }

  get language(): string {
    return this.props.language;
  }

  get status(): string {
    return this.props.status;
  }

  get publishedAt(): Date | null {
    return this.props.publishedAt;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  get version(): number {
    return this.props.version;
  }

  get createdById(): string {
    return this.props.createdById;
  }

  get updatedById(): string {
    return this.props.updatedById;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get languageCode(): LanguageCode | null {
    return getLanguageCodeType(this.language);
  }

  changeStatus({ status, updatedById }: { status: string; updatedById?: string }) {
    this.props.status = status;

    if (status === ContentStatus.published) {
      this.props.publishedAt = new Date();
    }

    if (updatedById) {
      this.props.updatedById = updatedById;
    }
  }

  delete(userId: string) {
    this.props.deletedAt = new Date();
    this.props.updatedById = userId;
  }

  restore(userId: string) {
    this.props.deletedAt = null;
    this.props.updatedById = userId;
  }

  hasNewVersion(contents: ContentEntity[]): boolean {
    return contents.some(
      (c) => c.props.language === this.props.language && c.props.version > this.props.version
    );
  }

  isPublished(): boolean {
    return this.props.status === ContentStatus.published;
  }

  updateContent({
    title,
    body,
    bodyJson,
    bodyHtml,
    coverUrl,
    updatedById,
  }: {
    title: string | null;
    body: string | null;
    bodyJson: string | null;
    bodyHtml: string | null;
    coverUrl: string | null;
    updatedById: string;
  }): void {
    this.props.title = title;
    this.props.body = body;
    this.props.bodyJson = bodyJson;
    this.props.bodyHtml = bodyHtml;
    this.props.coverUrl = coverUrl;
    this.props.updatedById = updatedById;
  }

  isSameLanguageContent(language: string) {
    return this.props.language.toLocaleLowerCase() === language.toLocaleLowerCase();
  }
}
