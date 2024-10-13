import { Content, ContentRevision } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { ContentStatus } from '../content/content.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

type ContentRevisionProps = Omit<ContentRevision, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

export class ContentRevisionEntity extends PrismaBaseEntity<ContentRevision> {
  static Construct(props: ContentRevisionProps): ContentRevisionEntity {
    const now = new Date();

    return new ContentRevisionEntity({
      ...props,
      id: v4(),
      status: ContentStatus.draft,
      createdAt: now,
      updatedAt: now,
    });
  }

  private isValid() {
    if (!this.props.id) {
      throw new UnexpectedException({ message: 'id is required' });
    }
  }

  beforeUpdateValidate(): void {
    this.isValid();
  }

  beforeInsertValidate(): void {
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

  get contentId(): string {
    return this.props.contentId;
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

  get summary(): string | null {
    return this.props.summary;
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

  review(updatedById: string) {
    this.props.status = ContentStatus.review;
    this.props.updatedById = updatedById;
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
