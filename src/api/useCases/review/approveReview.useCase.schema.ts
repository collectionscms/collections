import { z } from 'zod';

export const approveReviewUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  reviewId: z.string().uuid(),
});

export type ApproveReviewUseCaseSchemaType = z.infer<typeof approveReviewUseCaseSchema>;
