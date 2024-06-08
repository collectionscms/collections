import { Review } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export const reviewStatus = {
  Request: 'request',
  Approve: 'approve',
  Close: 'close',
} as const;
export type ReviewStatusType = (typeof reviewStatus)[keyof typeof reviewStatus];

export class ReviewEntity extends PrismaBaseEntity<Review> {
  static Construct({
    projectId,
    postId,
    revieweeId,
    title,
    body,
  }: {
    projectId: string;
    postId: string;
    revieweeId: string;
    title: string;
    body: string | null;
  }): ReviewEntity {
    const now = new Date();
    return new ReviewEntity({
      id: v4(),
      projectId,
      postId,
      revieweeId,
      reviewerId: null,
      title,
      body,
      status: reviewStatus.Request,
      createdAt: now,
      updatedAt: now,
    });
  }

  close(): void {
    this.props.status = reviewStatus.Close;
  }

  approve(): void {
    this.props.status = reviewStatus.Approve;
  }

  requestReview(title: string, body?: string): void {
    this.props.status = reviewStatus.Request;
    this.props.title = title;
    this.props.body = body || null;
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
