import { Review } from '@prisma/client';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export const reviewStatus = {
  request: 'request',
  approve: 'approve',
  close: 'close',
} as const;
export type ReviewStatusType = (typeof reviewStatus)[keyof typeof reviewStatus];

export class ReviewEntity extends PrismaBaseEntity<Review> {
  close(): void {
    this.props.status = reviewStatus.close;
  }

  approve(): void {
    this.props.status = reviewStatus.approve;
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

  get revieweeId(): string {
    return this.props.revieweeId;
  }
}
