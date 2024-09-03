import { Post } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { LocalizedPost, PostItem, PublishedContent, PublishedPost } from '../../../types/index.js';
import { ContentEntity } from '../content/content.entity.js';
import { ContentHistoryEntity } from '../contentHistory/contentHistory.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { ProjectEntity } from '../project/project.entity.js';
import { UserEntity } from '../user/user.entity.js';

type LanguageStatus = {
  language: string;
  statuses: string[];
  publishedAt: Date | null;
};

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
      slug: this.GenerateSlug(),
      createdById,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const content = ContentEntity.Construct({
      projectId,
      postId,
      language,
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
    sourceLanguage: string,
    contents: {
      content: ContentEntity;
      updatedBy: UserEntity;
    }[]
  ): PostItem {
    const sortedContents = contents.sort((a, b) => b.content.version - a.content.version);

    // Get content of language
    const languageContent =
      sortedContents.filter((c) => c.content.language === sourceLanguage)[0] || sortedContents[0];

    // Get language with statuses
    const languageStatues = this.getLanguageStatues(contents.map((c) => c.content));
    const sortedLanguageStatues = Object.entries(languageStatues)
      .map(([language, value]) => ({
        language,
        currentStatus: value.statuses[0],
        prevStatus: value.statuses[1],
      }))
      .sort((a) => (a.language === sourceLanguage ? -1 : 1));

    return {
      id: this.props.id,
      contentId: languageContent.content.id,
      title: languageContent.content.title ?? '',
      slug: this.props.slug,
      updatedByName: languageContent.updatedBy.name,
      updatedAt: this.props.updatedAt,
      languageStatues: sortedLanguageStatues,
    };
  }

  toLocalizedWithContentsResponse(
    language: string,
    project: ProjectEntity,
    contents: {
      content: ContentEntity;
      histories: ContentHistoryEntity[];
    }[]
  ): LocalizedPost {
    const sortedContents = contents.sort((a, b) => b.content.version - a.content.version);

    // Get content of language. If language is not found, get the first content.
    const languageContents = sortedContents.filter((c) => c.content.language === language);
    const languageContent = languageContents[0] || sortedContents[0];

    // Get the latest history of each version in the same language.
    const histories = this.getLatestHistoriesByLanguage(
      language,
      languageContent.content.version,
      languageContent.histories
    );

    // Get language statues.
    const languageStatues = this.getLanguageStatues(contents.map((c) => c.content));

    // Filter unique languages.
    const usedLanguages = [...new Set(contents.map((c) => c.content.language))];

    return {
      id: this.props.id,
      slug: this.props.slug,
      contentId: languageContent.content.id,
      currentStatus: languageStatues[languageContent.content.language].statuses[0],
      prevStatus: languageStatues[languageContent.content.language].statuses[1],
      updatedAt: languageContent.content.updatedAt,
      title: languageContent.content.title ?? '',
      body: languageContent.content.body ?? '',
      bodyJson: languageContent.content.bodyJson ?? '',
      bodyHtml: languageContent.content.bodyHtml ?? '',
      contentLanguage: languageContent.content.language,
      version: languageContent.content.version,
      coverUrl: languageContent.content.coverUrl,
      usedLanguages,
      canTranslate:
        project.isTranslationEnabled(languageContent.content.language) &&
        usedLanguages.includes(project.sourceLanguage),
      sourceLanguageCode: project.sourceLanguageCode?.code ?? null,
      targetLanguageCode: languageContent.content.languageCode?.code ?? null,
      histories,
    };
  }

  /**
   * Convert entity to published post response
   * @param language
   * @param contents
   * @returns
   */
  toPublishedContentsResponse(
    language: string | null,
    contents: {
      content: ContentEntity;
      createdBy: UserEntity;
    }[]
  ): PublishedPost {
    const groupByLngContents = this.groupByLanguage(contents);
    const filteredLngContents = language
      ? { [language]: groupByLngContents[language] }
      : groupByLngContents;

    return {
      id: this.props.id,
      slug: this.props.slug,
      contents: filteredLngContents,
    };
  }

  private getLanguageStatues(contents: ContentEntity[]): {
    [language: string]: LanguageStatus;
  } {
    return contents.reduce(
      (acc: { [language: string]: LanguageStatus }, content) => {
        const { language, status, publishedAt } = content;
        const languageStatus = acc[language];

        if (!languageStatus) {
          acc[language] = {
            language,
            statuses: [status],
            publishedAt,
          };
        } else if (!languageStatus.publishedAt) {
          acc[language].statuses.push(status);
        }

        return acc;
      },
      {} as { [language: string]: LanguageStatus }
    );
  }

  private groupByLanguage(
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
