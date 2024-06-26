import { Post } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { LocalizedPost } from '../../../types/index.js';
import { ContentEntity, contentStatus } from '../content/content.entity.js';
import { ContentHistoryEntity } from '../contentHistory/contentHistory.entity.js';
import { FileEntity } from '../file/file.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { UserEntity } from '../user/user.entity.js';

export const postStatus = {
  open: 'open',
  trashed: 'trashed',
} as const;
export type PostStatusType = (typeof postStatus)[keyof typeof postStatus];

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
    return this.projectId;
  }

  get status(): string {
    return this.props.status;
  }

  changeStatus(status: PostStatusType) {
    this.props.status = status;
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
      publishedAt:
        localeContents.filter((c) => c.content.publishedAt)[0]?.content.publishedAt ?? null,
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
