import { z } from 'zod';

export const getReviewUseCaseSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  reviewId: z.string(),
});

export type GetReviewUseCaseSchemaType = z.infer<typeof getReviewUseCaseSchema>;
