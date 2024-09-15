import { z } from 'zod';

export const approveReviewUseCaseSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  reviewId: z.string(),
});

export type ApproveReviewUseCaseSchemaType = z.infer<typeof approveReviewUseCaseSchema>;
