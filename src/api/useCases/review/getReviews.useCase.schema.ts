import { z } from 'zod';
import { ReviewStatus } from '../../persistence/review/review.entity.js';

export const getReviewsUseCaseSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  status: z.nativeEnum(ReviewStatus).optional(),
});

export type GetReviewsUseCaseSchemaType = z.infer<typeof getReviewsUseCaseSchema>;
