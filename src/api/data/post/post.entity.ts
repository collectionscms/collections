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
    locale: string,
    contents: {
      content: ContentEntity;
      file: FileEntity | null;
      createdBy: UserEntity;
      histories: ContentHistoryEntity[];
    }[]
  ): LocalizedPost {
    const localeContents = contents.filter((c) => c.content.locale === locale);

    // Get content of locale
    const localeContent = localeContents.sort((a, b) => b.content.version - a.content.version)[0];

    // Get unique locales
    const locales = [...new Set(contents.map((c) => c.content.locale))];

    // Get history of locale
    const histories = localeContents.reduce(
      (acc: ContentHistoryEntity[], c) => acc.concat(c.histories),
      []
    );

    return {
      id: this.props.id,
      slug: this.props.slug,
      contentId: localeContent.content.id,
      status: localeContent.content.status,
      updatedAt: localeContent.content.updatedAt,
      publishedAt: localeContent.content.publishedAt,
      title: localeContent.content.title ?? '',
      body: localeContent.content.body ?? '',
      bodyJson: localeContent.content.bodyJson ?? '',
      bodyHtml: localeContent.content.bodyHtml ?? '',
      contentLocale: localeContent.content.locale,
      locales,
      authorName: localeContent.createdBy.name,
      file: localeContent.file?.toResponseWithUrl() ?? null,
      histories: histories.map((history) => history.toResponse()),
    };
  }
}
