import { Content, Post } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import {
  LocalizedContentItem,
  PublishedListContent,
  PublishedPost,
  SourceLanguagePostItem,
  StatusHistory,
} from '../../../types/index.js';
import { ContentEntity } from '../content/content.entity.js';
import { ContentRevisionEntity } from '../contentRevision/contentRevision.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { UserEntity } from '../user/user.entity.js';

type PostProps = Omit<Post, 'id' | 'isInit' | 'createdAt' | 'updatedAt'> & {
  createdById?: string | null;
};

export class PostEntity extends PrismaBaseEntity<Post> {
  static Construct(
    props: PostProps,
    language: string
  ): {
    post: PostEntity;
    content: ContentEntity;
    contentRevision: ContentRevisionEntity;
  } {
    const postId = v4();
    const post = new PostEntity({
      id: postId,
      projectId: props.projectId,
      isInit: true,
      createdById: props.createdById,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const { content, contentRevision } = ContentEntity.Construct({
      projectId: props.projectId,
      postId,
      language,
      createdById: props.createdById,
    });

    return { post, content, contentRevision };
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

  get projectId(): string {
    return this.props.projectId;
  }

  get isInit(): boolean {
    return this.props.isInit;
  }

  unsetInit() {
    this.props.isInit = false;
  }

  /**
   * Convert entity to source language post item response
   * @param sourceLanguage
   * @param contents
   * @returns
   */
  toSourceLanguagePostItemResponse(
    sourceLanguage: string,
    contents: {
      content: ContentEntity;
      revisions: ContentRevisionEntity[];
    }[],
    users: UserEntity[]
  ): SourceLanguagePostItem {
    const sourceLngContent =
      contents.filter((c) => c.content.language === sourceLanguage)[0] || contents[0];

    const sourceLngContentRevision = ContentRevisionEntity.getLatestRevisionOfLanguage(
      sourceLngContent.revisions,
      sourceLngContent.content.language
    );

    const otherLngContents = contents.filter((c) => c.content.id !== sourceLngContent.content.id);
    const userMap = users.reduce(
      (acc, u) => {
        acc[u.id] = u;
        return acc;
      },
      {} as { [id: string]: UserEntity }
    );

    return {
      ...this.toLocalizedContentItem(
        sourceLngContentRevision.toContentResponse(),
        sourceLngContent.content.getStatusHistory(sourceLngContentRevision),
        userMap[sourceLngContentRevision.updatedById]?.name ?? ''
      ),
      localizedContents: otherLngContents.map((otherLngContent) => {
        const otherLngContentRevision = ContentRevisionEntity.getLatestRevisionOfLanguage(
          otherLngContent.revisions,
          otherLngContent.content.language
        );

        return this.toLocalizedContentItem(
          otherLngContentRevision.toContentResponse(),
          otherLngContent.content.getStatusHistory(otherLngContentRevision),
          userMap[otherLngContentRevision.updatedById]?.name ?? ''
        );
      }),
    };
  }

  private toLocalizedContentItem(
    content: Content,
    statusHistory: StatusHistory,
    updatedByName: string
  ): LocalizedContentItem {
    return {
      contentId: content.id,
      postId: content.postId,
      title: content.title ?? '',
      slug: content.slug,
      language: content.language,
      status: statusHistory,
      updatedByName,
      updatedAt: content.updatedAt,
    };
  }

  /**
   * Convert entity to published post response
   * @param language
   * @param contents
   * @returns
   */
  toPublishedPostResponse(
    language: string | null,
    contents: {
      content: ContentEntity;
      createdBy: UserEntity;
    }[]
  ): PublishedPost | null {
    const groupByLngContents = this.groupContentsByLanguage(contents);
    const filteredLngContents = language
      ? { [language]: groupByLngContents[language] }
      : groupByLngContents;

    return {
      id: this.props.id,
      contents: Object.values(filteredLngContents),
    };
  }

  private groupContentsByLanguage(
    contents: {
      content: ContentEntity;
      createdBy: UserEntity;
    }[]
  ): { [language: string]: PublishedListContent } {
    return contents.reduce(
      (acc, c) => {
        const content = c.content;
        const createdBy = c.createdBy;

        if (!acc[content.language] && content.publishedAt) {
          acc[content.language] = {
            id: content.id,
            slug: content.slug,
            title: content.title ?? '',
            subtitle: content.subtitle,
            body: content.body ?? '',
            bodyHtml: content.bodyHtml ?? '',
            status: content.status,
            language: content.language,
            version: content.currentVersion,
            coverUrl: content.coverUrl,
            metaTitle: content.metaTitle,
            metaDescription: content.metaDescription,
            publishedAt: content.publishedAt,
            author: {
              id: createdBy.id,
              name: createdBy.name,
              avatarUrl: createdBy.image,
            },
          };
        }

        return acc;
      },
      {} as { [language: string]: PublishedListContent }
    );
  }
}
