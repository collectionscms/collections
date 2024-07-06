import { Post } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { LocalizedPost, PostItem } from '../../../types/index.js';
import { ContentEntity } from '../content/content.entity.js';
import { ContentHistoryEntity } from '../contentHistory/contentHistory.entity.js';
import { FileEntity } from '../file/file.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { UserEntity } from '../user/user.entity.js';

export const postStatus = {
  open: 'open',
  trashed: 'trashed',
} as const;
export type PostStatusType = (typeof postStatus)[keyof typeof postStatus];

type LocaleStatus = {
  locale: string;
  statuses: string[];
  publishedAt: Date | null;
};

export class PostEntity extends PrismaBaseEntity<Post> {
  static Construct({
    projectId,
    locale,
    createdById,
  }: {
    projectId: string;
    locale: string;
    createdById: string;
  }): { post: PostEntity; content: ContentEntity } {
    const postId = v4();
    const post = new PostEntity({
      id: postId,
      projectId,
      slug: this.GenerateSlug(),
      status: postStatus.open,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const content = ContentEntity.Construct({
      projectId,
      postId,
      locale,
      createdById,
    });

    return { post, content };
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

  static GenerateSlug = () => {
    return v4().trim().replace(/-/g, '').substring(0, 10);
  };

  get id(): string {
    return this.props.id;
  }

  get projectId(): string {
    return this.props.projectId;
  }

  get status(): string {
    return this.props.status;
  }

  changeStatus(status: PostStatusType) {
    this.props.status = status;
  }

  toPostItemResponse(
    locale: string,
    contents: {
      content: ContentEntity;
      updatedBy: UserEntity;
    }[]
  ): PostItem {
    const sortedContents = contents.sort((a, b) => b.content.version - a.content.version);

    // Get content of locale
    const localeContent = sortedContents.filter((c) => c.content.locale === locale)[0];

    // Get locale with statuses
    const localeStatues: {
      [locale: string]: LocaleStatus;
    } = contents.reduce(
      (acc: { [locale: string]: LocaleStatus }, { content }) => {
        const { locale, status, publishedAt } = content;
        if (!acc[locale]) {
          acc[locale] = {
            locale,
            statuses: [status],
            publishedAt: null,
          };
        } else {
          acc[locale].statuses.push(status);
        }

        if (publishedAt && !acc[locale].publishedAt) {
          acc[locale].publishedAt = publishedAt;
        }

        return acc;
      },
      {} as { [locale: string]: LocaleStatus }
    );

    return {
      id: this.props.id,
      contentId: localeContent.content.id,
      title: localeContent.content.title ?? '',
      slug: this.props.slug,
      updatedByName: localeContent.updatedBy.name,
      updatedAt: this.props.updatedAt,
      localeStatues: Object.entries(localeStatues).map(([locale, value]) => ({
        locale,
        statuses: value.statuses,
        publishedAt: value.publishedAt,
      })),
    };
  }

  toLocalizedWithContentsResponse(
    locale: string,
    contents: {
      content: ContentEntity;
      file: FileEntity | null;
      histories: ContentHistoryEntity[];
    }[]
  ): LocalizedPost {
    const sortedContents = contents.sort((a, b) => b.content.version - a.content.version);

    // Get content of locale
    const localeContents = sortedContents.filter((c) => c.content.locale === locale);
    const localeContent = localeContents[0];

    // Get history of locale
    const histories = localeContents.reduce(
      (acc: ContentHistoryEntity[], c) => acc.concat(c.histories),
      []
    );

    // Get unique locales
    const locales = [...new Set(contents.map((c) => c.content.locale))];

    return {
      id: this.props.id,
      slug: this.props.slug,
      contentId: localeContent.content.id,
      status: localeContent.content.status,
      updatedAt: localeContent.content.updatedAt,
      publishedAt:
        localeContents.filter((c) => c.content.publishedAt)[0]?.content.publishedAt ?? null,
      title: localeContent.content.title ?? '',
      body: localeContent.content.body ?? '',
      bodyJson: localeContent.content.bodyJson ?? '',
      bodyHtml: localeContent.content.bodyHtml ?? '',
      contentLocale: localeContent.content.locale,
      version: localeContent.content.version,
      locales,
      file: localeContent.file?.toResponseWithUrl() ?? null,
      histories: histories.map((history) => history.toResponse()),
    };
  }
}
