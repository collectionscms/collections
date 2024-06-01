import { Review } from '@prisma/client';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export const reviewStatus = {
  request: 'request',
  approve: 'approve',
  close: 'close',
} as const;
export type ReviewStatusType = (typeof reviewStatus)[keyof typeof reviewStatus];

export class ReviewEntity extends PrismaBaseEntity<Review> {}
