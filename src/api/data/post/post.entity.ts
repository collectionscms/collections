import { Post } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { LocalizedPost, PostItem, PublishedPost } from '../../../types/index.js';
import { ContentEntity } from '../content/content.entity.js';
import { ContentHistoryEntity } from '../contentHistory/contentHistory.entity.js';
import { FileEntity } from '../file/file.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { UserEntity } from '../user/user.entity.js';

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
      createdById,
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

  get slug(): string {
    return this.props.slug;
  }

  updatePost({ slug }: { slug?: string }): void {
    if (slug) {
      this.props.slug = slug;
    }
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
    const localeContent =
      sortedContents.filter((c) => c.content.locale === locale)[0] || sortedContents[0];

    // Get locale with statuses
    const localeStatues = this.getLocaleStatues(contents.map((c) => c.content));

    return {
      id: this.props.id,
      contentId: localeContent.content.id,
      title: localeContent.content.title ?? '',
      slug: this.props.slug,
      updatedByName: localeContent.updatedBy.name,
      updatedAt: this.props.updatedAt,
      localeStatues: Object.entries(localeStatues).map(([locale, value]) => ({
        locale,
        currentStatus: value.statuses[0],
        prevStatus: value.statuses[1],
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

    // Get content of locale. If locale is not found, get the first content.
    const localeContents = sortedContents.filter((c) => c.content.locale === locale);
    const localeContent = localeContents[0] || sortedContents[0];

    // Get history of locale
    const histories = localeContents.reduce(
      (acc: ContentHistoryEntity[], c) => acc.concat(c.histories),
      []
    );

    // Get locale statues
    const localeStatues = this.getLocaleStatues(contents.map((c) => c.content));

    // Filter unique locales
    const locales = [...new Set(contents.map((c) => c.content.locale))];

    return {
      id: this.props.id,
      slug: this.props.slug,
      contentId: localeContent.content.id,
      currentStatus: localeStatues[localeContent.content.locale].statuses[0],
      prevStatus: localeStatues[localeContent.content.locale].statuses[1],
      updatedAt: localeContent.content.updatedAt,
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

  toPublishedWithContentsResponse(
    locale: string | null,
    sourceLanguage: string,
    contents: {
      content: ContentEntity;
      file: FileEntity | null;
      updatedBy: UserEntity;
    }[]
  ): PublishedPost {
    const sortedContents = contents.sort((a, b) => b.content.version - a.content.version);

    // Get content of locale. If locale is not found, get the primary locale content or first content.
    const localeContents = sortedContents.filter((c) => c.content.locale === locale);
    const sourceLanguageContents = sortedContents.filter(
      (c) => c.content.locale === sourceLanguage
    );
    const localeContent = localeContents[0] || sourceLanguageContents[0] || sortedContents[0];

    return {
      id: this.props.id,
      slug: this.props.slug,
      title: localeContent.content.title ?? '',
      body: localeContent.content.bodyHtml ?? '',
      contentLocale: localeContent.content.locale,
      file: localeContent.file?.toResponseWithUrl() ?? null,
      updatedAt: localeContent.content.updatedAt,
      updatedByName: localeContent.updatedBy.name,
    };
  }

  private getLocaleStatues(contents: ContentEntity[]): { [locale: string]: LocaleStatus } {
    return contents.reduce(
      (acc: { [locale: string]: LocaleStatus }, content) => {
        const { locale, status, publishedAt } = content;
        const localeStatus = acc[locale];

        if (!localeStatus) {
          acc[locale] = {
            locale,
            statuses: [status],
            publishedAt,
          };
        } else if (!localeStatus.publishedAt) {
          acc[locale].statuses.push(status);
        }

        return acc;
      },
      {} as { [locale: string]: LocaleStatus }
    );
  }
}
