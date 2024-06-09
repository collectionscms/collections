import { z } from 'zod';

export const requestReviewUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  title: z.string(),
  body: z.string().optional(),
});

export type RequestReviewUseCaseSchemaType = z.infer<typeof requestReviewUseCaseSchema>;
