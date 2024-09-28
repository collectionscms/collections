import { Content, ContentRevision } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { ContentStatus } from '../content/content.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class ContentRevisionEntity extends PrismaBaseEntity<ContentRevision> {
  static Construct({
    projectId,
    postId,
    contentId,
    slug,
    coverUrl,
    title,
    body,
    bodyJson,
    bodyHtml,
    excerpt,
    metaTitle,
    metaDescription,
    publishedAt,
    language,
    createdById,
    updatedById,
    version,
    deletedAt,
  }: {
    projectId: string;
    postId: string;
    contentId: string;
    slug: string;
    coverUrl?: string | null;
    title?: string | null;
    body?: string | null;
    bodyJson?: string | null;
    bodyHtml?: string | null;
    excerpt?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    publishedAt?: Date | null;
    language: string;
    createdById: string;
    updatedById: string;
    version: number;
    deletedAt: Date | null;
  }): ContentRevisionEntity {
    const now = new Date();

    return new ContentRevisionEntity({
      id: v4(),
      projectId,
      contentId,
      postId,
      slug,
      coverUrl: coverUrl || null,
      title: title || null,
      body: body || null,
      bodyJson: bodyJson || null,
      bodyHtml: bodyHtml || null,
      excerpt: excerpt || null,
      metaTitle: metaTitle ?? null,
      metaDescription: metaDescription ?? null,
      language,
      status: ContentStatus.draft,
      publishedAt: publishedAt || null,
      version,
      createdById,
      updatedById,
      deletedAt,
      createdAt: now,
      updatedAt: now,
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

  get slug(): string {
    return this.props.slug;
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

  get excerpt(): string | null {
    return this.props.excerpt;
  }

  get metaTitle(): string | null {
    return this.props.metaTitle;
  }

  get metaDescription(): string | null {
    return this.props.metaDescription;
  }

  get coverUrl(): string | null {
    return this.props.coverUrl;
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

  private copyProps(): ContentRevision {
    const copy = {
      ...this.props,
    };
    return Object.freeze(copy);
  }

  static getLatestRevisionOfLanguage = (revisions: ContentRevisionEntity[], language: string) => {
    const latestRevision = revisions
      .filter((revision) => revision.language === language)
      .sort((a, b) => b.version - a.version)[0];

    return latestRevision;
  };

  updateContent({
    title,
    body,
    bodyJson,
    bodyHtml,
    coverUrl,
    slug,
    excerpt,
    metaTitle,
    metaDescription,
    updatedById,
  }: {
    title?: string | null;
    body?: string | null;
    bodyJson?: string | null;
    bodyHtml?: string | null;
    coverUrl?: string | null;
    slug?: string;
    excerpt?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    updatedById: string;
  }): void {
    Object.assign(this.props, {
      ...(title !== undefined && { title }),
      ...(body !== undefined && { body }),
      ...(bodyJson !== undefined && { bodyJson }),
      ...(bodyHtml !== undefined && { bodyHtml }),
      ...(coverUrl !== undefined && { coverUrl }),
      ...(excerpt !== undefined && { excerpt }),
      ...(metaTitle !== undefined && { metaTitle }),
      ...(metaDescription !== undefined && { metaDescription }),
      ...(slug !== undefined && { slug: encodeURIComponent(slug) }),
      updatedById,
    });
  }

  isPublished(): boolean {
    return this.props.status === ContentStatus.published;
  }

  draft() {
    this.props.status = ContentStatus.draft;
  }

  publish(updatedById: string) {
    this.props.status = ContentStatus.published;
    this.props.publishedAt = new Date();
    this.props.updatedById = updatedById;
  }

  archive() {
    this.props.status = ContentStatus.archived;
  }

  trash() {
    this.props.status = ContentStatus.trashed;
    this.props.deletedAt = new Date();
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

  toResponse(): ContentRevision {
    return this.copyProps();
  }

  toContentResponse(): Content {
    return {
      ...this.copyProps(),
      id: this.props.contentId,
      currentVersion: this.props.version,
    };
  }
}
