import { ContentHistory } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class ContentHistoryEntity extends PrismaBaseEntity<ContentHistory> {
  static Construct({
    projectId,
    postId,
    coverUrl,
    title,
    body,
    bodyJson,
    bodyHtml,
    publishedAt,
    language,
    status,
    createdById,
    updatedById,
    version,
    deletedAt,
  }: {
    projectId: string;
    postId: string;
    coverUrl?: string | null;
    title?: string | null;
    body?: string | null;
    bodyJson?: string | null;
    bodyHtml?: string | null;
    publishedAt?: Date | null;
    language: string;
    status: string;
    createdById: string;
    updatedById: string;
    version: number;
    deletedAt: Date | null;
  }): ContentHistoryEntity {
    return new ContentHistoryEntity({
      id: v4(),
      projectId,
      postId,
      coverUrl: coverUrl || null,
      title: title || null,
      body: body || null,
      bodyJson: bodyJson || null,
      bodyHtml: bodyHtml || null,
      language,
      status,
      publishedAt: publishedAt || null,
      version,
      createdById,
      updatedById,
      deletedAt,
      createdAt: new Date(),
    });
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

  private copyProps(): ContentHistory {
    const copy = {
      ...this.props,
    };
    return Object.freeze(copy);
  }

  toResponse(): ContentHistory {
    return this.copyProps();
  }
}
