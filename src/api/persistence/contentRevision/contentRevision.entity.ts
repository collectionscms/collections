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
    status,
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
    status: string;
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
      status,
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

  get version(): number {
    return this.props.version;
  }

  get language(): string {
    return this.props.language;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  private copyProps(): ContentRevision {
    const copy = {
      ...this.props,
    };
    return Object.freeze(copy);
  }

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
