import { z } from 'zod';

export const getReviewUseCaseSchema = z.object({
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

export type GetReviewUseCaseSchemaType = z.infer<typeof getReviewUseCaseSchema>;
