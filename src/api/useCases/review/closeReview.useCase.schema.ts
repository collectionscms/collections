import { z } from 'zod';

export const closeReviewUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  reviewId: z.string().uuid(),
});

export type CloseReviewUseCaseSchemaType = z.infer<typeof closeReviewUseCaseSchema>;
