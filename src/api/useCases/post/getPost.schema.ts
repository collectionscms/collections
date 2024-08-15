import { z } from 'zod';

export const getPostUseCaseSchema = z.object({
  projectId: z.string(),
  postId: z.string(),
  userId: z.string(),
  language: z.string(),
});

export type GetPostUseCaseSchemaType = z.infer<typeof getPostUseCaseSchema>;
