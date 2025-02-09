import { Content } from '@prisma/client';
import { v4 } from 'uuid';
import { getLanguageCodeType, LanguageCode } from '../../../constants/languages.js';
import { env } from '../../../env.js';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import {
  PublishedContent,
  PublishedListContent,
  RevisedContent,
  StatusHistory,
} from '../../../types/index.js';
import { generateKey } from '../../utilities/generateKey.js';
import { AlumnusEntity } from '../alumnus/alumnus.entity.js';
import { AwardEntity } from '../award/award.entity.js';
import { ContentRevisionEntity } from '../contentRevision/contentRevision.entity.js';
import { ExperienceEntity } from '../experience/experience.entity.js';
import { ExperienceResourceEntity } from '../experienceResource/experienceResource.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { ProjectEntity } from '../project/project.entity.js';
import { SocialProfileEntity } from '../socialProfile/socialProfile.entity.js';
import { SpokenLanguageEntity } from '../spokenLanguage/spokenLanguage.entity.js';
import { TagEntity } from '../tag/tag.entity.js';
import { UserEntity } from '../user/user.entity.js';

export const ContentStatus = {
  draft: 'draft',
  review: 'review',
  published: 'published',
  archived: 'archived',
  trashed: 'trashed',
} as const;
export type ContentStatus = (typeof ContentStatus)[keyof typeof ContentStatus];

type ContentProps = Omit<
  Content,
  | 'id'
  | 'slug'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyJson'
  | 'bodyHtml'
  | 'metaTitle'
  | 'metaDescription'
  | 'coverUrl'
  | 'currentVersion'
  | 'draftKey'
  | 'status'
  | 'updatedById'
  | 'publishedAt'
  | 'deletedAt'
  | 'createdAt'
  | 'updatedAt'
> & {
  slug?: string | null;
  subtitle?: string | null;
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
    const slug = props.slug ?? generateKey();
    const draftKey = generateKey();

    const contentRevision = ContentRevisionEntity.Construct({
      projectId: props.projectId,
      postId: props.postId,
      contentId,
      slug,
      title: props.title ?? null,
      subtitle: props.subtitle ?? null,
      body: props.body ?? null,
      bodyJson: props.bodyJson ?? null,
      bodyHtml: props.bodyHtml ?? null,
      metaTitle: props.metaTitle ?? null,
      metaDescription: props.metaDescription ?? null,
      coverUrl: props.coverUrl ?? null,
      language: props.language,
      publishedAt: null,
      version: props.currentVersion ?? 1,
      draftKey,
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
      subtitle: props.subtitle ?? null,
      body: props.body ?? null,
      bodyJson: props.bodyJson ?? null,
      bodyHtml: props.bodyHtml ?? null,
      metaTitle: props.metaTitle ?? null,
      metaDescription: props.metaDescription ?? null,
      coverUrl: props.coverUrl ?? null,
      language: props.language,
      status: ContentStatus.draft,
      publishedAt: null,
      currentVersion: props.currentVersion ?? 1,
      draftKey,
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

    if (this.props.slug !== this.props.slug.toLowerCase()) {
      throw new UnexpectedException({ message: 'slug must be lowercase' });
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

  get subtitle(): string | null {
    return this.props.subtitle;
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

  draft(updatedById: string) {
    this.props.status = ContentStatus.draft;
    this.props.updatedById = updatedById;
  }

  restore(status: string, userId: string) {
    this.props.status = status;
    this.props.updatedById = userId;
    this.props.deletedAt = null;
  }

  revert({
    title,
    subtitle,
    body,
    bodyJson,
    bodyHtml,
    coverUrl,
    slug,
    metaTitle,
    metaDescription,
    status,
    version,
    publishedAt,
    updatedById,
  }: {
    title: string;
    subtitle: string | null;
    body: string;
    bodyJson: string;
    bodyHtml: string;
    coverUrl: string | null;
    slug: string;
    metaTitle: string | null;
    metaDescription: string | null;
    status: string;
    publishedAt: Date | null;
    version: number;
    updatedById: string;
  }) {
    Object.assign(this.props, {
      title,
      subtitle,
      body,
      bodyJson,
      bodyHtml,
      coverUrl,
      slug,
      metaTitle,
      metaDescription,
      status,
      currentVersion: version,
      publishedAt,
      updatedById,
    });
  }

  publish({
    title,
    subtitle,
    body,
    bodyJson,
    bodyHtml,
    coverUrl,
    slug,
    metaTitle,
    metaDescription,
    currentVersion,
    updatedById,
  }: {
    title: string;
    subtitle: string | null;
    body: string;
    bodyJson: string;
    bodyHtml: string;
    coverUrl: string | null;
    slug: string;
    metaTitle: string | null;
    metaDescription: string | null;
    currentVersion: number;
    updatedById: string;
  }) {
    Object.assign(this.props, {
      title,
      subtitle,
      body,
      bodyJson,
      bodyHtml,
      coverUrl,
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
    subtitle,
    body,
    bodyJson,
    bodyHtml,
    coverUrl,
    slug,
    metaTitle,
    metaDescription,
    updatedById,
  }: {
    title?: string | null;
    subtitle?: string | null;
    body?: string | null;
    bodyJson?: string | null;
    bodyHtml?: string | null;
    coverUrl?: string | null;
    slug?: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
    updatedById: string;
  }): void {
    Object.assign(this.props, {
      ...(title !== undefined && { title }),
      ...(subtitle !== undefined && { subtitle }),
      ...(body !== undefined && { body }),
      ...(bodyJson !== undefined && { bodyJson }),
      ...(bodyHtml !== undefined && { bodyHtml }),
      ...(coverUrl !== undefined && { coverUrl }),
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
    if (!env.TRANSLATOR_API_KEY) return false;

    // Same language
    return sourceLanguage.code !== this.props.language;
  }

  getStatusHistory = (revision: ContentRevisionEntity): StatusHistory => {
    return {
      currentStatus: revision.status,
      prevStatus: revision.version !== this.props.currentVersion ? this.props.status : null,
      isReviewing: revision.status === ContentStatus.review,
      isPublished: revision.status === ContentStatus.published,
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
    revisions: ContentRevisionEntity[],
    tags?: TagEntity[]
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
      subtitle: latestRevision.subtitle,
      body: latestRevision.body ?? '',
      bodyJson: latestRevision.bodyJson ?? '',
      bodyHtml: latestRevision.bodyHtml ?? '',
      metaTitle: latestRevision.metaTitle,
      metaDescription: latestRevision.metaDescription,
      coverUrl: latestRevision.coverUrl,
      language: latestRevision.language,
      languageContents,
      canTranslate: this.isTranslationEnabled(sourceLanguage, targetLanguage),
      sourceLanguageCode: project.sourceLanguageCode?.code ?? null,
      targetLanguageCode: this.languageCode?.code ?? null,
      draftKey: latestRevision.getDraftKey(),
      revisions: revisions.map((revision) => revision.toResponse()),
      tags: tags ? tags.map((tag) => tag.toResponse()) : [],
    };
  }

  /**
   * Returns published list content results for external use.
   * @param createdBy
   * @returns
   */
  toPublishedListContentResponse(createdBy: UserEntity): PublishedListContent {
    if (!this.props.publishedAt) {
      throw new RecordNotFoundException('record_not_found');
    }

    return {
      id: this.props.id,
      slug: this.props.slug,
      title: this.props.title ?? '',
      subtitle: this.props.subtitle,
      body: this.props.body ?? '',
      bodyHtml: this.props.bodyHtml ?? '',
      status: this.props.status,
      language: this.props.language,
      version: this.props.currentVersion,
      coverUrl: this.props.coverUrl,
      metaTitle: this.props.metaTitle,
      metaDescription: this.props.metaDescription,
      publishedAt: this.props.publishedAt,
      author: {
        id: createdBy.id,
        name: createdBy.name,
        avatarUrl: createdBy.image,
        bio: createdBy.bio,
        bioUrl: createdBy.bioUrl,
        employer: createdBy.employer,
        jobTitle: createdBy.jobTitle,
      },
    };
  }

  /**
   * Returns published content results for external use.
   * @param createdBy
   * @param tags
   * @returns
   */
  toPublishedContentResponse(
    createdBy: UserEntity,
    tags: TagEntity[],
    spokenLanguages: SpokenLanguageEntity[],
    awards: AwardEntity[],
    socialProfiles: SocialProfileEntity[],
    alumni: AlumnusEntity[],
    experienceWithResources: {
      experience: ExperienceEntity;
      resources: ExperienceResourceEntity[];
    }[]
  ): PublishedContent {
    return {
      id: this.props.id,
      slug: this.props.slug,
      title: this.props.title ?? '',
      subtitle: this.props.subtitle,
      body: this.props.body ?? '',
      bodyHtml: this.props.bodyHtml ?? '',
      status: this.props.status,
      language: this.props.language,
      version: this.props.currentVersion,
      coverUrl: this.props.coverUrl,
      metaTitle: this.props.metaTitle,
      metaDescription: this.props.metaDescription,
      publishedAt: this.props.publishedAt as Date,
      author: {
        id: createdBy.id,
        name: createdBy.name,
        avatarUrl: createdBy.image,
        bio: createdBy.bio,
        bioUrl: createdBy.bioUrl,
        employer: createdBy.employer,
        jobTitle: createdBy.jobTitle,
        spokenLanguages: spokenLanguages.map((spokenLanguage) => ({
          language: spokenLanguage.language,
        })),
        awards: awards.map((award) => ({
          name: award.name,
        })),
        socialProfiles: socialProfiles.map((socialProfile) => ({
          provider: socialProfile.provider,
          url: socialProfile.url,
        })),
        alumni: alumni.map((alumnus) => ({
          name: alumnus.name,
          url: alumnus.url,
        })),
        experiences: experienceWithResources.map((experienceWithResource) => ({
          name: experienceWithResource.experience.name,
          url: experienceWithResource.experience.url,
          resources: experienceWithResource.resources.map((resource) => ({
            url: resource.url,
          })),
        })),
      },
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    };
  }
}
