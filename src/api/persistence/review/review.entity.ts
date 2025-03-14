import { Review } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export const ReviewStatus = {
  Pending: 'pending',
  Approved: 'approved',
  Closed: 'closed',
} as const;
export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];

export class ReviewEntity extends PrismaBaseEntity<Review> {
  static Construct({
    projectId,
    postId,
    contentId,
    revieweeId,
    comment,
  }: {
    projectId: string;
    postId: string;
    contentId: string;
    revieweeId: string;
    comment: string;
  }): ReviewEntity {
    const now = new Date();
    return new ReviewEntity({
      id: v4(),
      projectId,
      postId,
      contentId,
      revieweeId,
      reviewerId: null,
      comment,
      status: ReviewStatus.Pending,
      createdAt: now,
      updatedAt: now,
    });
  }

  close(): void {
    this.props.status = ReviewStatus.Closed;
  }

  approve(): void {
    this.props.status = ReviewStatus.Approved;
  }

  requestReview(comment: string): void {
    this.props.status = ReviewStatus.Pending;
    this.props.comment = comment;
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

  get contentId(): string {
    return this.props.contentId;
  }

  get projectId(): string {
    return this.props.projectId;
  }

  get revieweeId(): string {
    return this.props.revieweeId;
  }
}
