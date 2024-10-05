import { z } from 'zod';

export const getReviewUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  reviewId: z.string().uuid(),
});

export type GetReviewUseCaseSchemaType = z.infer<typeof getReviewUseCaseSchema>;
