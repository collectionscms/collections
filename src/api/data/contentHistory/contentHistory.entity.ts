import { ContentHistory } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class ContentHistoryEntity extends PrismaBaseEntity<ContentHistory> {
  static Construct({
    projectId,
    contentId,
    userId,
    status,
    version,
  }: {
    projectId: string;
    contentId: string;
    userId: string;
    status: string;
    version: number;
  }): ContentHistoryEntity {
    return new ContentHistoryEntity({
      id: v4(),
      projectId,
      contentId,
      userId,
      status,
      version,
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
