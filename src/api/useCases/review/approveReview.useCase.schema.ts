import { z } from 'zod';

export const approveReviewUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  reviewId: z.string().uuid(),
  isAdmin: z.boolean(),
  permissions: z.array(
    z.object({
      action: z.string(),
    })
  ),
});

export type ApproveReviewUseCaseSchemaType = z.infer<typeof approveReviewUseCaseSchema>;
