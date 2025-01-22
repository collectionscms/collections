import { Review } from '@prisma/client';
import { v4 } from 'uuid';
import { ReviewEntity, ReviewStatus } from './review.entity.js';

const defaultValue = {
  id: v4(),
  projectId: v4(),
  postId: v4(),
  contentId: v4(),
  revieweeId: v4(),
  reviewerId: v4(),
  comment: 'comment',
  status: ReviewStatus.Pending,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buildReviewEntity = <K extends keyof Review>(props?: {
  [key in K]: Review[key];
}): ReviewEntity => {
  return ReviewEntity.Reconstruct<Review, ReviewEntity>({
    ...defaultValue,
    ...props,
  });
};
