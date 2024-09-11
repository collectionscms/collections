import { Post } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import {
  ContentStatus,
  LocalizedContentItem,
  PublishedContent,
  PublishedPost,
  SourceLanguagePostItem,
} from '../../../types/index.js';
import { ContentEntity } from '../content/content.entity.js';
import { ContentHistoryEntity } from '../contentHistory/contentHistory.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { UserEntity } from '../user/user.entity.js';

export class PostEntity extends PrismaBaseEntity<Post> {
  static Construct({
    projectId,
    language,
    createdById,
  }: {
    projectId: string;
    language: string;
    createdById: string;
  }): { post: PostEntity; content: ContentEntity } {
    const postId = v4();
    const post = new PostEntity({
      id: postId,
      projectId,
      createdById,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const content = ContentEntity.Construct({
      projectId,
      postId,
      language,
      slug: ContentEntity.generateSlug(),
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

  get id(): string {
    return this.props.id;
  }

  get projectId(): string {
    return this.props.projectId;
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
      updatedBy: UserEntity;
    }[]
  ): SourceLanguagePostItem {
    const sortedContents = contents.sort((a, b) => b.content.version - a.content.version);

    const sourceLngContent =
      sortedContents.filter((c) => c.content.language === sourceLanguage)[0] || sortedContents[0];

    // Filter for latest ver content in other languages
    const otherLngContents = Object.values(
      sortedContents.reduce(
        (acc, c) => {
          if (
            c.content.id !== sourceLngContent.content.id &&
            c.content.language !== sourceLanguage
          ) {
            if (!acc[c.content.language]) {
              acc[c.content.language] = c;
            }
          }
          return acc;
        },
        {} as Record<string, (typeof sortedContents)[0]>
      )
    );

    const languageStatues = this.getLanguageStatues(contents.map((c) => c.content));

    return {
      ...this.toLocalizedContentItem(
        sourceLngContent.content,
        sourceLngContent.updatedBy,
        languageStatues[sourceLngContent.content.language]
      ),
      localizedContents: otherLngContents.map((otherLngContent) =>
        this.toLocalizedContentItem(
          otherLngContent.content,
          otherLngContent.updatedBy,
          languageStatues[otherLngContent.content.language]
        )
      ),
    };
  }

  private toLocalizedContentItem(
    content: ContentEntity,
    updatedBy: UserEntity,
    contentStatus: ContentStatus
  ): LocalizedContentItem {
    return {
      contentId: content.id,
      postId: content.postId,
      title: content.title ?? '',
      slug: content.slug,
      language: content.language,
      status: contentStatus,
      updatedByName: updatedBy.name,
      updatedAt: content.updatedAt,
    };
  }

  private getLanguageStatues(contents: ContentEntity[]): {
    [language: string]: ContentStatus;
  } {
    const sortedContents = contents.sort((a, b) => b.version - a.version);

    return sortedContents.reduce(
      (acc: { [language: string]: ContentStatus }, content) => {
        const { language, status } = content;
        const languageStatus = acc[language];

        if (!languageStatus) {
          acc[language] = {
            prevStatus: null,
            currentStatus: status,
          };
        } else if (languageStatus) {
          acc[language] = {
            ...acc[language],
            prevStatus: status,
          };
        }

        return acc;
      },
      {} as { [language: string]: ContentStatus }
    );
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
    if (language && !groupByLngContents[language]) {
      return null;
    }

    const filteredLngContents = language
      ? { [language]: groupByLngContents[language] }
      : groupByLngContents;

    return {
      id: this.props.id,
      contents: filteredLngContents,
    };
  }

  private groupContentsByLanguage(
    contents: {
      content: ContentEntity;
      createdBy: UserEntity;
    }[]
  ): { [language: string]: PublishedContent } {
    return contents.reduce(
      (acc, c) => {
        const content = c.content;
        const createdBy = c.createdBy;

        if (!acc[content.language] && content.publishedAt) {
          acc[content.language] = {
            slug: content.slug,
            title: content.title ?? '',
            body: content.body ?? '',
            bodyHtml: content.bodyHtml ?? '',
            language: content.language,
            version: content.version,
            coverUrl: content.coverUrl,
            publishedAt: content.publishedAt,
            author: {
              id: createdBy.id,
              name: createdBy.name,
              avatarUrl: createdBy.avatarUrl,
            },
          };
        }

        return acc;
      },
      {} as { [language: string]: PublishedContent }
    );
  }

  /**
   * Get the latest history of each version in the same language.
   * @param language
   * @param currentVersion
   * @param histories
   * @returns
   */
  private getLatestHistoriesByLanguage(
    language: string,
    currentVersion: number,
    histories: ContentHistoryEntity[]
  ) {
    const filteredHistories = histories.filter((history) => history.language === language);

    const latestHistories: { [version: number]: ContentHistoryEntity } = filteredHistories.reduce(
      (acc: { [version: number]: ContentHistoryEntity }, history) => {
        const version = history.version;
        if (version > currentVersion) {
          // Deleted case
          return acc;
        }

        if (!acc[version] || acc[version].createdAt < history.createdAt) {
          acc[version] = history;
        }
        return acc;
      },
      {}
    );

    return Object.values(latestHistories).map((history) => history.toResponse());
  }
}
