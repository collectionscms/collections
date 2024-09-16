import { Review, User } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { UserEntity } from '../user/user.entity.js';
import { ReviewEntity } from './review.entity.js';

export class ReviewRepository {
  async findOwnManyWithUser(
    prisma: ProjectPrismaType,
    options: { userId: string; status?: string }
  ): Promise<
    {
      review: ReviewEntity;
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
        reviewee: true,
        reviewer: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) => ({
      review: ReviewEntity.Reconstruct<Review, ReviewEntity>(record),
      reviewee: UserEntity.Reconstruct<User, UserEntity>(record.reviewee),
      reviewer: record.reviewer ? UserEntity.Reconstruct<User, UserEntity>(record.reviewer) : null,
    }));
  }

  async findOwnOne(
    prisma: ProjectPrismaType,
    userId: string,
    id: string
  ): Promise<{
    review: ReviewEntity;
    reviewee: UserEntity;
    reviewer: UserEntity | null;
  }> {
    const record = await prisma.review.findFirstOrThrow({
      where: {
        id,
        OR: [{ revieweeId: userId }, { reviewerId: userId }],
      },
      include: {
        reviewee: true,
        reviewer: true,
      },
    });

    return {
      review: ReviewEntity.Reconstruct<Review, ReviewEntity>(record),
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
      reviewee: UserEntity;
      reviewer: UserEntity | null;
    }[]
  > {
    const records = await prisma.review.findMany({
      where: {
        status: options?.status,
      },
      include: {
        reviewee: true,
        reviewer: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) => ({
      review: ReviewEntity.Reconstruct<Review, ReviewEntity>(record),
      reviewee: UserEntity.Reconstruct<User, UserEntity>(record.reviewee),
      reviewer: record.reviewer ? UserEntity.Reconstruct<User, UserEntity>(record.reviewer) : null,
    }));
  }

  async findOne(
    prisma: ProjectPrismaType,
    id: string
  ): Promise<{
    review: ReviewEntity;
    reviewee: UserEntity;
    reviewer: UserEntity | null;
  }> {
    const record = await prisma.review.findUniqueOrThrow({
      where: { id },
      include: {
        reviewee: true,
        reviewer: true,
      },
    });

    return {
      review: ReviewEntity.Reconstruct<Review, ReviewEntity>(record),
      reviewee: UserEntity.Reconstruct<User, UserEntity>(record.reviewee),
      reviewer: record.reviewer ? UserEntity.Reconstruct<User, UserEntity>(record.reviewer) : null,
    };
  }

  async findOneByContentId(
    prisma: ProjectPrismaType,
    contentId: string
  ): Promise<ReviewEntity | null> {
    const record = await prisma.review.findFirst({ where: { contentId } });
    return record ? ReviewEntity.Reconstruct<Review, ReviewEntity>(record) : null;
  }

  async upsert(prisma: ProjectPrismaType, review: ReviewEntity): Promise<ReviewEntity> {
    review.beforeUpdateValidate();

    const record = await prisma.review.upsert({
      where: { id: review.id },
      create: review.toPersistence(),
      update: review.toPersistence(),
    });
    return ReviewEntity.Reconstruct<Review, ReviewEntity>(record);
  }

  async updateStatus(prisma: ProjectPrismaType, review: ReviewEntity): Promise<ReviewEntity> {
    const record = await prisma.review.update({
      where: { id: review.id },
      data: { status: review.status },
    });
    return ReviewEntity.Reconstruct<Review, ReviewEntity>(record);
  }
}
