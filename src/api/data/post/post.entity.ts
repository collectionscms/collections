import { Post } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { LocalizedPost } from '../../../types/index.js';
import { ContentEntity } from '../content/content.entity.js';
import { ContentHistoryEntity } from '../contentHistory/contentHistory.entity.js';
import { FileEntity } from '../file/file.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { UserEntity } from '../user/user.entity.js';

export const status = {
  draft: 'draft',
  review: 'review',
  published: 'published',
  archived: 'archived',
} as const;
export type StatusType = (typeof status)[keyof typeof status];

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
    return this.projectId;
  }

  toLocalizedWithContentsResponse(
    defaultLocale: string,
    contents: {
      content: ContentEntity;
      file: FileEntity | null;
      createdBy: UserEntity;
      histories: ContentHistoryEntity[];
    }[]
  ): LocalizedPost {
    const latestContentsPerLocale = Object.values(
      contents.reduce(
        (
          acc: {
            [key: string]: {
              content: ContentEntity;
              createdBy: UserEntity;
              histories: ContentHistoryEntity[];
            };
          },
          c
        ) => {
          if (!acc[c.content.locale] || acc[c.content.locale].content.version < c.content.version) {
            acc[c.content.locale] = c;
          }
          return acc;
        },
        {}
      )
    );

    // Get content of default locale
    const defaultLocaleContent =
      latestContentsPerLocale.find((c) => c.content.locale === defaultLocale) ||
      latestContentsPerLocale[0];

    // Get unique locales
    const locales = [...new Set(contents.map((c) => c.content.locale))];

    return {
      id: this.props.id,
      slug: this.props.slug,
      status: defaultLocaleContent.content.status,
      updatedAt: defaultLocaleContent.content.updatedAt,
      publishedAt: defaultLocaleContent.content.publishedAt,
      title: defaultLocaleContent.content.title ?? '',
      body: defaultLocaleContent.content.body ?? '',
      bodyJson: defaultLocaleContent.content.bodyJson ?? '',
      bodyHtml: defaultLocaleContent.content.bodyHtml ?? '',
      contentLocale: defaultLocaleContent.content.locale,
      locales,
      authorName: defaultLocaleContent.createdBy.name,
      contents: contents.map((c) => ({
        ...c.content.toResponse(),
        file: c.file?.toResponseWithUrl() ?? null,
      })),
      histories: defaultLocaleContent.histories.map((history) => history.toResponse()),
    };
  }
}
