import { Content, Post } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import {
  LocalizedContentItem,
  LocalizedPost,
  PublishedContent,
  PublishedPost,
  SourceLanguagePostItem,
  StatusHistory,
} from '../../../types/index.js';
import { ContentEntity } from '../content/content.entity.js';
import { ContentRevisionEntity } from '../contentRevision/contentRevision.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { ProjectEntity } from '../project/project.entity.js';
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
  }): { post: PostEntity; content: ContentEntity; contentRevision: ContentRevisionEntity } {
    const postId = v4();
    const post = new PostEntity({
      id: postId,
      projectId,
      createdById,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const { content, contentRevision } = ContentEntity.Construct({
      projectId,
      postId,
      language,
      createdById,
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
    }[]
  ): SourceLanguagePostItem {
    const sourceLngContent =
      contents.filter((c) => c.content.language === sourceLanguage)[0] || contents[0];

    const sourceLngContentRevision = ContentRevisionEntity.getVersionRevision(
      sourceLngContent.content.currentVersion,
      sourceLanguage,
      sourceLngContent.revisions
    );

    const otherLngContents = contents.filter((c) => c.content.id !== sourceLngContent.content.id);

    return {
      ...this.toLocalizedContentItem(
        sourceLngContentRevision.toContentResponse(),
        sourceLngContent.content.getStatusHistory(sourceLngContentRevision)
      ),
      localizedContents: otherLngContents.map((otherLngContent) => {
        const otherLngContentRevision = ContentRevisionEntity.getVersionRevision(
          otherLngContent.content.currentVersion,
          otherLngContent.content.language,
          otherLngContent.revisions
        );

        return this.toLocalizedContentItem(
          otherLngContentRevision.toContentResponse(),
          otherLngContent.content.getStatusHistory(otherLngContentRevision)
        );
      }),
    };
  }

  private toLocalizedContentItem(
    content: Content,
    statusHistory: StatusHistory
  ): LocalizedContentItem {
    return {
      contentId: content.id,
      postId: content.postId,
      title: content.title ?? '',
      slug: content.slug,
      language: content.language,
      status: statusHistory,
      updatedAt: content.updatedAt,
    };
  }

  toLocalizedPostResponse(
    project: ProjectEntity,
    usedLanguages: string[],
    content: ContentEntity,
    createdBy: UserEntity,
    updatedBy: UserEntity,
    revisions: ContentRevisionEntity[]
  ): LocalizedPost {
    const latestRevisions = this.getLatestRevisionsByLanguage(
      content.language,
      content.currentVersion,
      revisions
    );

    return {
      id: this.props.id,
      slug: content.slug,
      contentId: content.id,
      status: content.getStatusHistory(revisions[0]),
      updatedAt: content.updatedAt,
      title: content.title ?? '',
      body: content.body ?? '',
      bodyJson: content.bodyJson ?? '',
      bodyHtml: content.bodyHtml ?? '',
      language: content.language,
      version: content.currentVersion,
      excerpt: content.excerpt,
      metaTitle: content.metaTitle,
      metaDescription: content.metaDescription,
      coverUrl: content.coverUrl,
      canTranslate: content.isTranslationEnabled(project.sourceLanguage),
      usedLanguages,
      sourceLanguageCode: project.sourceLanguageCode?.code ?? null,
      targetLanguageCode: content.languageCode?.code ?? null,
      createdByName: createdBy.name,
      updatedByName: updatedBy.name,
      revisions: latestRevisions,
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
            id: content.id,
            slug: content.slug,
            title: content.title ?? '',
            body: content.body ?? '',
            bodyHtml: content.bodyHtml ?? '',
            language: content.language,
            version: content.currentVersion,
            excerpt: content.getExcerptOrBodyPreview(),
            coverUrl: content.coverUrl,
            metaTitle: content.metaTitle,
            metaDescription: content.metaDescription,
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
   * Get the latest revision of each version in the same language.
   * @param language
   * @param currentVersion
   * @param revisions
   * @returns
   */
  private getLatestRevisionsByLanguage(
    language: string,
    currentVersion: number,
    revisions: ContentRevisionEntity[]
  ) {
    const filteredRevisions = revisions.filter((history) => history.language === language);

    const latestRevisions: { [version: number]: ContentRevisionEntity } = filteredRevisions.reduce(
      (acc: { [version: number]: ContentRevisionEntity }, history) => {
        const version = history.version;
        if (version > currentVersion) {
          // Deleted case
          return acc;
        }

        if (!acc[version] || acc[version].updatedAt < history.updatedAt) {
          acc[version] = history;
        }
        return acc;
      },
      {}
    );

    return Object.values(latestRevisions).map((history) => history.toResponse());
  }
}
