import { z } from 'zod';

export const requestReviewUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  comment: z.string(),
});

export type RequestReviewUseCaseSchemaType = z.infer<typeof requestReviewUseCaseSchema>;
