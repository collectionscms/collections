import { Content } from '@prisma/client';
import { v4 } from 'uuid';
import { getLanguageCodeType, LanguageCode } from '../../../constants/languages.js';
import { env } from '../../../env.js';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PublishedContent, StatusHistory } from '../../../types/index.js';
import { ContentRevisionEntity } from '../contentRevision/contentRevision.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { UserEntity } from '../user/user.entity.js';

export const ContentStatus = {
  draft: 'draft',
  review: 'review',
  published: 'published',
  archived: 'archived',
} as const;
export type ContentStatusType = (typeof ContentStatus)[keyof typeof ContentStatus];

const EXCERPT_LENGTH = 150;

type ContentProps = Omit<
  Content,
  | 'id'
  | 'slug'
  | 'title'
  | 'body'
  | 'bodyJson'
  | 'bodyHtml'
  | 'excerpt'
  | 'metaTitle'
  | 'metaDescription'
  | 'coverUrl'
  | 'currentVersion'
  | 'status'
  | 'updatedById'
  | 'publishedAt'
  | 'deletedAt'
  | 'createdAt'
  | 'updatedAt'
> & {
  slug?: string | null;
  excerpt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  coverUrl?: string | null;
  title?: string | null;
  body?: string | null;
  bodyJson?: string | null;
  bodyHtml?: string | null;
  currentVersion?: number;
};

export class ContentEntity extends PrismaBaseEntity<Content> {
  static Construct(props: ContentProps): {
    content: ContentEntity;
    contentRevision: ContentRevisionEntity;
  } {
    const now = new Date();
    const contentId = v4();
    const slug = props.slug ?? this.generateSlug();

    const contentRevision = ContentRevisionEntity.Construct({
      projectId: props.projectId,
      postId: props.postId,
      contentId,
      slug,
      title: props.title ?? null,
      body: props.body ?? null,
      bodyJson: props.bodyJson ?? null,
      bodyHtml: props.bodyHtml ?? null,
      excerpt: props.excerpt ?? null,
      metaTitle: props.metaTitle ?? null,
      metaDescription: props.metaDescription ?? null,
      coverUrl: props.coverUrl ?? null,
      language: props.language,
      status: ContentStatus.draft,
      publishedAt: null,
      version: props.currentVersion ?? 1,
      createdById: props.createdById,
      updatedById: props.createdById,
      deletedAt: null,
    });

    const content = new ContentEntity({
      id: contentId,
      projectId: props.projectId,
      postId: props.postId,
      slug,
      title: props.title ?? null,
      body: props.body ?? null,
      bodyJson: props.bodyJson ?? null,
      bodyHtml: props.bodyHtml ?? null,
      excerpt: props.excerpt ?? null,
      metaTitle: props.metaTitle ?? null,
      metaDescription: props.metaDescription ?? null,
      coverUrl: props.coverUrl ?? null,
      language: props.language,
      status: ContentStatus.draft,
      publishedAt: null,
      currentVersion: props.currentVersion ?? 1,
      createdById: props.createdById,
      updatedById: props.createdById,
      deletedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    return { content, contentRevision };
  }

  private isValid() {
    if (!this.props.id) {
      throw new UnexpectedException({ message: 'id is required' });
    }
  }

  public beforeUpdateValidate(): void {
    this.isValid();

    if (!encodeURIComponent(this.props.slug)) {
      throw new UnexpectedException({ message: 'Invalid slug format' });
    }
  }

  public beforeInsertValidate(): void {
    this.isValid();

    if (!encodeURIComponent(this.props.slug)) {
      throw new UnexpectedException({ message: 'Invalid slug format' });
    }
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

  get currentVersion(): number {
    return this.props.currentVersion;
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

  static generateSlug = () => {
    return v4().trim().replace(/-/g, '').substring(0, 10);
  };

  getExcerptOrBodyPreview(): string {
    const text = this.excerpt || this.body;
    const preview = text.slice(0, EXCERPT_LENGTH);
    return text.length > EXCERPT_LENGTH ? `${preview}...` : preview;
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

  isPublished(): boolean {
    return this.props.status === ContentStatus.published;
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

  isSameLanguageContent(language: string) {
    return this.props.language.toLocaleLowerCase() === language.toLocaleLowerCase();
  }

  isTranslationEnabled(sourceLanguage: string): boolean {
    if (!env.TRANSLATE_API_KEY) return false;
    return sourceLanguage !== this.props.language;
  }

  statusHistory = (): StatusHistory => {
    return {
      prevStatus:
        this.props.currentVersion > 1 && this.props.status !== ContentStatus.published
          ? ContentStatus.published
          : null,
      currentStatus: this.props.status,
    };
  };

  /**
   * Convert entity to published content response
   * @param content
   * @param createdBy
   * @returns
   */
  toPublishedContentResponse(createdBy: UserEntity): PublishedContent {
    if (!this.props.publishedAt) {
      throw new RecordNotFoundException('record_not_found');
    }

    return {
      id: this.props.id,
      slug: this.props.slug,
      title: this.props.title ?? '',
      body: this.props.body ?? '',
      bodyHtml: this.props.bodyHtml ?? '',
      language: this.props.language,
      version: this.props.currentVersion,
      coverUrl: this.props.coverUrl,
      excerpt: this.getExcerptOrBodyPreview(),
      metaTitle: this.props.metaTitle,
      metaDescription: this.props.metaDescription,
      publishedAt: this.props.publishedAt,
      author: {
        id: createdBy.id,
        name: createdBy.name,
        avatarUrl: createdBy.avatarUrl,
      },
    };
  }
}
