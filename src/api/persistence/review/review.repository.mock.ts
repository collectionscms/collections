import { ProjectPrismaType } from '../../database/prisma/client.js';
import { buildContentEntity } from '../content/content.entity.fixture.js';
import { ContentEntity } from '../content/content.entity.js';
import { buildUserEntity } from '../user/user.entity.fixture.js';
import { UserEntity } from '../user/user.entity.js';
import { ReviewEntity } from './review.entity';
import { buildReviewEntity } from './review.entity.fixture.js';
import { ReviewRepository } from './review.repository.js';

export class InMemoryReviewRepository extends ReviewRepository {
  async findOneWithContentAndParticipant(
    _prisma: ProjectPrismaType,
    id: string
  ): Promise<{
    review: ReviewEntity;
    content: ContentEntity;
    reviewee: UserEntity;
    reviewer: UserEntity | null;
  } | null> {
    return {
      review: buildReviewEntity({
        id,
      }),
      content: buildContentEntity(),
      reviewee: buildUserEntity({
        id: 'reviewee-id',
      }),
      reviewer: buildUserEntity({
        id: 'reviewer-id',
      }),
    };
  }

  async findOwnOneWithContentAndParticipant(
    _prisma: ProjectPrismaType,
    userId: string,
    id: string
  ): Promise<{
    review: ReviewEntity;
    content: ContentEntity;
    reviewee: UserEntity;
    reviewer: UserEntity | null;
  } | null> {
    return {
      review: buildReviewEntity({
        id,
      }),
      content: buildContentEntity(),
      reviewee: buildUserEntity({
        id: userId,
      }),
      reviewer: buildUserEntity({
        id: 'reviewer-id',
      }),
    };
  }

  async updateStatus(_prisma: ProjectPrismaType, review: ReviewEntity): Promise<ReviewEntity> {
    return review;
  }
}
