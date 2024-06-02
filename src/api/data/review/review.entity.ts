import { Review } from '@prisma/client';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export const reviewStatus = {
  Request: 'request',
  Approve: 'approve',
  Close: 'close',
} as const;
export type ReviewStatusType = (typeof reviewStatus)[keyof typeof reviewStatus];

export class ReviewEntity extends PrismaBaseEntity<Review> {
  close(): void {
    this.props.status = reviewStatus.Close;
  }

  approve(): void {
    this.props.status = reviewStatus.Approve;
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

  get status(): string {
    return this.props.status;
  }

  get postId(): string {
    return this.props.postId;
  }

  get projectId(): string {
    return this.props.projectId;
  }

  get revieweeId(): string {
    return this.props.revieweeId;
  }
}
