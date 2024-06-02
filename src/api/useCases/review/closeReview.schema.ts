import { z } from 'zod';

export const closeReviewUseCaseSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  reviewId: z.string(),
});

export type CloseReviewUseCaseSchemaType = z.infer<typeof closeReviewUseCaseSchema>;
