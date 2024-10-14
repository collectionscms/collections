import { z } from 'zod';
import { ReviewStatus } from '../../persistence/review/review.entity.js';

export const getReviewsUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.nativeEnum(ReviewStatus).optional(),
  isAdmin: z.boolean(),
  permissions: z.array(
    z.object({
      action: z.string(),
    })
  ),
});

export type GetReviewsUseCaseSchemaType = z.infer<typeof getReviewsUseCaseSchema>;
