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

  async findMany(prisma: ProjectPrismaType): Promise<ReviewEntity[]> {
    const records = await prisma.review.findMany();
    return records.map((record) => ReviewEntity.Reconstruct<Review, ReviewEntity>(record));
  }
}
