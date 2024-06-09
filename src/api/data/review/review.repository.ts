import { Review } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ReviewEntity } from './review.entity.js';

export class ReviewRepository {
  async findOwnMany(prisma: ProjectPrismaType, userId: string): Promise<ReviewEntity[]> {
    const records = await prisma.review.findMany({
      where: {
        OR: [{ revieweeId: userId }, { reviewerId: userId }],
      },
    });
    return records.map((record) => ReviewEntity.Reconstruct<Review, ReviewEntity>(record));
  }

  async findOwnOne(prisma: ProjectPrismaType, userId: string, id: string): Promise<ReviewEntity> {
    const record = await prisma.review.findFirstOrThrow({
      where: {
        id,
        OR: [{ revieweeId: userId }, { reviewerId: userId }],
      },
    });
    return ReviewEntity.Reconstruct<Review, ReviewEntity>(record);
  }

  async findMany(prisma: ProjectPrismaType): Promise<ReviewEntity[]> {
    const records = await prisma.review.findMany();
    return records.map((record) => ReviewEntity.Reconstruct<Review, ReviewEntity>(record));
  }

  async findOne(prisma: ProjectPrismaType, id: string): Promise<ReviewEntity> {
    const record = await prisma.review.findUniqueOrThrow({ where: { id } });
    return ReviewEntity.Reconstruct<Review, ReviewEntity>(record);
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
