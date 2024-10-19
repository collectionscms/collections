import { Content, Review, User } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from '../content/content.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { ReviewEntity } from './review.entity.js';

export class ReviewRepository {
  async findOwnManyWithUser(
    prisma: ProjectPrismaType,
    options: { userId: string; status?: string }
  ): Promise<
    {
      review: ReviewEntity;
      content: ContentEntity;
      reviewee: UserEntity;
      reviewer: UserEntity | null;
    }[]
  > {
    const records = await prisma.review.findMany({
      where: {
        OR: [{ revieweeId: options.userId }, { reviewerId: options.userId }],
        status: options?.status,
      },
      include: {
        content: true,
        reviewee: true,
        reviewer: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) => ({
      review: ReviewEntity.Reconstruct<Review, ReviewEntity>(record),
      content: ContentEntity.Reconstruct<Content, ContentEntity>(record.content),
      reviewee: UserEntity.Reconstruct<User, UserEntity>(record.reviewee),
      reviewer: record.reviewer ? UserEntity.Reconstruct<User, UserEntity>(record.reviewer) : null,
    }));
  }

  async findOwnOneWithContentAndParticipant(
    prisma: ProjectPrismaType,
    userId: string,
    id: string
  ): Promise<{
    review: ReviewEntity;
    content: ContentEntity;
    reviewee: UserEntity;
    reviewer: UserEntity | null;
  } | null> {
    const record = await prisma.review.findFirst({
      where: {
        id,
        OR: [{ revieweeId: userId }, { reviewerId: userId }],
      },
      include: {
        content: true,
        reviewee: true,
        reviewer: true,
      },
    });

    if (!record) return null;

    return {
      review: ReviewEntity.Reconstruct<Review, ReviewEntity>(record),
      content: ContentEntity.Reconstruct<Content, ContentEntity>(record.content),
      reviewee: UserEntity.Reconstruct<User, UserEntity>(record.reviewee),
      reviewer: record.reviewer ? UserEntity.Reconstruct<User, UserEntity>(record.reviewer) : null,
    };
  }

  async findManyWithUser(
    prisma: ProjectPrismaType,
    options?: { status: string }
  ): Promise<
    {
      review: ReviewEntity;
      content: ContentEntity;
      reviewee: UserEntity;
      reviewer: UserEntity | null;
    }[]
  > {
    const records = await prisma.review.findMany({
      where: {
        status: options?.status,
      },
      include: {
        content: true,
        reviewee: true,
        reviewer: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) => ({
      review: ReviewEntity.Reconstruct<Review, ReviewEntity>(record),
      content: ContentEntity.Reconstruct<Content, ContentEntity>(record.content),
      reviewee: UserEntity.Reconstruct<User, UserEntity>(record.reviewee),
      reviewer: record.reviewer ? UserEntity.Reconstruct<User, UserEntity>(record.reviewer) : null,
    }));
  }

  async findOneWithContentAndParticipant(
    prisma: ProjectPrismaType,
    id: string
  ): Promise<{
    review: ReviewEntity;
    content: ContentEntity;
    reviewee: UserEntity;
    reviewer: UserEntity | null;
  } | null> {
    const record = await prisma.review.findUnique({
      where: { id },
      include: {
        content: true,
        reviewee: true,
        reviewer: true,
      },
    });

    if (!record) return null;

    return {
      review: ReviewEntity.Reconstruct<Review, ReviewEntity>(record),
      content: ContentEntity.Reconstruct<Content, ContentEntity>(record.content),
      reviewee: UserEntity.Reconstruct<User, UserEntity>(record.reviewee),
      reviewer: record.reviewer ? UserEntity.Reconstruct<User, UserEntity>(record.reviewer) : null,
    };
  }

  async create(prisma: ProjectPrismaType, review: ReviewEntity): Promise<ReviewEntity> {
    review.beforeInsertValidate();

    const record = await prisma.review.create({
      data: review.toPersistence(),
    });
    return ReviewEntity.Reconstruct<Review, ReviewEntity>(record);
  }

  async updateStatus(prisma: ProjectPrismaType, review: ReviewEntity): Promise<ReviewEntity> {
    review.beforeUpdateValidate();

    const record = await prisma.review.update({
      where: { id: review.id },
      data: { status: review.status },
    });
    return ReviewEntity.Reconstruct<Review, ReviewEntity>(record);
  }
}
