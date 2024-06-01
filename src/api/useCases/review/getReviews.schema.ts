import { z } from 'zod';

export const getReviewsUseCaseSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
});

export type GetReviewsUseCaseSchemaType = z.infer<typeof getReviewsUseCaseSchema>;
