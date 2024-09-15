import { z } from 'zod';

export const requestReviewUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  comment: z.string(),
});

export type RequestReviewUseCaseSchemaType = z.infer<typeof requestReviewUseCaseSchema>;
