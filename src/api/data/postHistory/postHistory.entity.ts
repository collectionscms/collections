import { PostHistory } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { UnexpectedException } from '../../../exceptions/unexpected.js';

export class PostHistoryEntity extends PrismaBaseEntity<PostHistory> {
  static Construct({
    projectId,
    postId,
    userName,
    status,
    version,
  }: {
    projectId: string;
    postId: string;
    userName: string;
    status: string;
    version: number;
  }): PostHistoryEntity {
    return new PostHistoryEntity({
      id: v4(),
      projectId,
      postId,
      userName,
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

  private copyProps(): PostHistory {
    const copy = {
      ...this.props,
    };
    return Object.freeze(copy);
  }

  toResponse(): PostHistory {
    return this.copyProps();
  }
}
