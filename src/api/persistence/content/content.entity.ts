import { Content } from '@prisma/client';
import { v4 } from 'uuid';
import { getLanguageCodeType, LanguageCode } from '../../../constants/languages.js';
import { env } from '../../../env.js';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PublishedContent, RevisedContent, StatusHistory } from '../../../types/index.js';
import { ContentRevisionEntity } from '../contentRevision/contentRevision.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { ProjectEntity } from '../project/project.entity.js';
import { UserEntity } from '../user/user.entity.js';

export const ContentStatus = {
  draft: 'draft',
  review: 'review',
  published: 'published',
  archived: 'archived',
  trashed: 'trashed',
} as const;
export type ContentStatusType = (typeof ContentStatus)[keyof typeof ContentStatus];

const SUMMARY_LENGTH = 150;

type ContentProps = Omit<
  Content,
  | 'id'
  | 'slug'
  | 'title'
  | 'body'
  | 'bodyJson'
  | 'bodyHtml'
  | 'summary'
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
  summary?: string | null;
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
      summary: props.summary ?? null,
      metaTitle: props.metaTitle ?? null,
      metaDescription: props.metaDescription ?? null,
      coverUrl: props.coverUrl ?? null,
      language: props.language,
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
      summary: props.summary ?? null,
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

  beforeUpdateValidate(): void {
    this.isValid();

    if (!encodeURIComponent(this.props.slug)) {
      throw new UnexpectedException({ message: 'Invalid slug format' });
    }
  }

  beforeInsertValidate(): void {
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

  getSummaryOrBodyPreview(): string {
    const text = this.summary || this.body;
    const preview = text.slice(0, SUMMARY_LENGTH);
    return text.length > SUMMARY_LENGTH ? `${preview}...` : preview;
  }

  draft(updatedById: string) {
    this.props.status = ContentStatus.draft;
    this.props.updatedById = updatedById;
  }

  restore(status: string, userId: string) {
    this.props.status = status;
    this.props.updatedById = userId;
    this.props.deletedAt = null;
  }

  revert(status: string, version: number, userId: string) {
    this.props.status = status;
    this.props.currentVersion = version;
    this.props.updatedById = userId;
  }

  publish({
    title,
    body,
    bodyJson,
    bodyHtml,
    coverUrl,
    slug,
    summary,
    metaTitle,
    metaDescription,
    currentVersion,
    updatedById,
  }: {
    title: string;
    body: string;
    bodyJson: string;
    bodyHtml: string;
    coverUrl: string | null;
    slug: string;
    summary: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    currentVersion: number;
    updatedById: string;
  }) {
    Object.assign(this.props, {
      title,
      body,
      bodyJson,
      bodyHtml,
      coverUrl,
      summary,
      metaTitle,
      metaDescription,
      slug,
      status: ContentStatus.published,
      currentVersion,
      publishedAt: new Date(),
      updatedById,
    });
  }

  archive(currentVersion: number, updatedById: string) {
    this.props.currentVersion = currentVersion;
    this.props.status = ContentStatus.archived;
    this.props.updatedById = updatedById;
  }

  trash(updatedById: string) {
    this.props.status = ContentStatus.trashed;
    this.props.deletedAt = new Date();
    this.props.updatedById = updatedById;
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

  isTranslationEnabled(
    sourceLanguage: LanguageCode | null,
    targetLanguage: LanguageCode | null
  ): boolean {
    // Non-translatable language
    if (!sourceLanguage?.sourceLanguageCode || !targetLanguage?.targetLanguageCode) return false;

    // Api key is not set
    if (!env.TRANSLATE_API_KEY) return false;

    // Same language
    return sourceLanguage.code !== this.props.language;
  }

  getStatusHistory = (revision: ContentRevisionEntity): StatusHistory => {
    return {
      currentStatus: revision.status,
      prevStatus: revision.version !== this.props.currentVersion ? this.props.status : null,
    };
  };

  /**
   * Return content results for the latest revision for internal use.
   * @param project
   * @param languageContents
   * @param latestRevision
   * @param revisions
   * @returns
   */
  toRevisedContentResponse(
    project: ProjectEntity,
    languageContents: { contentId: string; language: string }[],
    latestRevision: ContentRevisionEntity,
    revisions: ContentRevisionEntity[]
  ): RevisedContent {
    const sourceLanguage = getLanguageCodeType(project.sourceLanguage);
    const targetLanguage = getLanguageCodeType(latestRevision.language);

    return {
      id: this.props.id,
      postId: this.props.postId,
      slug: latestRevision.slug,
      status: this.getStatusHistory(latestRevision),
      updatedAt: latestRevision.updatedAt,
      version: latestRevision.version,
      title: latestRevision.title ?? '',
      body: latestRevision.body ?? '',
      bodyJson: latestRevision.bodyJson ?? '',
      bodyHtml: latestRevision.bodyHtml ?? '',
      summary: latestRevision.summary,
      metaTitle: latestRevision.metaTitle,
      metaDescription: latestRevision.metaDescription,
      coverUrl: latestRevision.coverUrl,
      language: latestRevision.language,
      languageContents,
      canTranslate: this.isTranslationEnabled(sourceLanguage, targetLanguage),
      sourceLanguageCode: project.sourceLanguageCode?.code ?? null,
      targetLanguageCode: this.languageCode?.code ?? null,
      revisions: revisions.map((revision) => revision.toResponse()),
    };
  }

  /**
   * Returns published content results for external use.
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
      excerpt: this.getSummaryOrBodyPreview(),
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
