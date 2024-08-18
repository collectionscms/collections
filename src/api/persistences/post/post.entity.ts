import { Post } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { LocalizedPost, PostItem, PublishedPost } from '../../../types/index.js';
import { ContentEntity } from '../content/content.entity.js';
import { ContentHistoryEntity } from '../contentHistory/contentHistory.entity.js';
import { FileEntity } from '../file/file.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
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
    language: string,
    contents: {
      content: ContentEntity;
      updatedBy: UserEntity;
    }[]
  ): PostItem {
    const sortedContents = contents.sort((a, b) => b.content.version - a.content.version);

    // Get content of language
    const languageContent =
      sortedContents.filter((c) => c.content.language === language)[0] || sortedContents[0];

    // Get language with statuses
    const languageStatues = this.getLanguageStatues(contents.map((c) => c.content));

    return {
      id: this.props.id,
      contentId: languageContent.content.id,
      title: languageContent.content.title ?? '',
      slug: this.props.slug,
      updatedByName: languageContent.updatedBy.name,
      updatedAt: this.props.updatedAt,
      languageStatues: Object.entries(languageStatues).map(([language, value]) => ({
        language,
        currentStatus: value.statuses[0],
        prevStatus: value.statuses[1],
      })),
    };
  }

  toLocalizedWithContentsResponse(
    language: string,
    contents: {
      content: ContentEntity;
      file: FileEntity | null;
      histories: ContentHistoryEntity[];
    }[]
  ): LocalizedPost {
    const sortedContents = contents.sort((a, b) => b.content.version - a.content.version);

    // Get content of language. If language is not found, get the first content.
    const languageContents = sortedContents.filter((c) => c.content.language === language);
    const languageContent = languageContents[0] || sortedContents[0];

    // Get history of language
    const histories = languageContents.reduce(
      (acc: ContentHistoryEntity[], c) => acc.concat(c.histories),
      []
    );

    // Get language statues
    const languageStatues = this.getLanguageStatues(contents.map((c) => c.content));

    // Filter unique languages
    const languages = [...new Set(contents.map((c) => c.content.language))];

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
      languages,
      file: languageContent.file?.toResponseWithUrl() ?? null,
      histories: histories.map((history) => history.toResponse()),
    };
  }

  toPublishedWithContentsResponse(
    language: string | null,
    sourceLanguage: string,
    contents: {
      content: ContentEntity;
      file: FileEntity | null;
      updatedBy: UserEntity;
    }[]
  ): PublishedPost {
    const sortedContents = contents.sort((a, b) => b.content.version - a.content.version);

    // Get content of language. If language is not found, get the primary language content or first content.
    const languageContents = sortedContents.filter((c) => c.content.language === language);
    const sourceLanguageContents = sortedContents.filter(
      (c) => c.content.language === sourceLanguage
    );
    const languageContent = languageContents[0] || sourceLanguageContents[0] || sortedContents[0];

    return {
      id: this.props.id,
      slug: this.props.slug,
      title: languageContent.content.title ?? '',
      body: languageContent.content.bodyHtml ?? '',
      contentLanguage: languageContent.content.language,
      file: languageContent.file?.toResponseWithUrl() ?? null,
      updatedAt: languageContent.content.updatedAt,
      updatedByName: languageContent.updatedBy.name,
    };
  }

  private getLanguageStatues(contents: ContentEntity[]): { [language: string]: LanguageStatus } {
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
}