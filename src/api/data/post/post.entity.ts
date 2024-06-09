import { Post } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { LocalizedPost } from '../../../types/index.js';
import { ContentEntity } from '../content/content.entity.js';
import { FileEntity } from '../file/file.entity.js';
import { PostHistoryEntity } from '../postHistory/postHistory.entity.js';
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
    defaultLocale,
    createdById,
  }: {
    projectId: string;
    defaultLocale: string;
    createdById: string;
  }): { post: PostEntity; content: ContentEntity } {
    const postId = v4();
    const post = new PostEntity({
      id: postId,
      projectId,
      slug: this.GenerateSlug(),
      defaultLocale,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const content = ContentEntity.Construct({
      projectId,
      postId,
      locale: defaultLocale,
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

  get defaultLocale(): string {
    return this.props.defaultLocale;
  }

  toLocalizedWithContentsResponse(
    locale: string,
    contents: { content: ContentEntity; file: FileEntity | null; createdBy: UserEntity }[],
    histories: PostHistoryEntity[]
  ): LocalizedPost {
    const localizedOrDefaultContent =
      contents.find((c) => c.content.isSameLocaleContent(locale)) || contents[0];
    const locales = contents.map((c) => c.content.locale);

    return {
      id: this.props.id,
      slug: this.props.slug,
      defaultLocale: this.props.defaultLocale,
      status: localizedOrDefaultContent.content.status,
      updatedAt: localizedOrDefaultContent.content.updatedAt,
      publishedAt: localizedOrDefaultContent.content.publishedAt,
      title: localizedOrDefaultContent.content.title ?? '',
      body: localizedOrDefaultContent.content.body ?? '',
      bodyJson: localizedOrDefaultContent.content.bodyJson ?? '',
      bodyHtml: localizedOrDefaultContent.content.bodyHtml ?? '',
      contentLocale: localizedOrDefaultContent.content.locale || this.props.defaultLocale,
      locales,
      authorName: localizedOrDefaultContent.createdBy.name,
      contents: contents.map((c) => ({
        ...c.content.toResponse(),
        file: c.file?.toResponseWithUrl() ?? null,
      })),
      histories: histories.map((history) => history.toResponse()),
    };
  }
}
