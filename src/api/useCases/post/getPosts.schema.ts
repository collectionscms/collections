import { z } from 'zod';

export const getPostsUseCaseSchema = z.object({
  projectId: z.string(),
  sourceLanguage: z.string(),
  userId: z.string(),
});

export type GetPostsUseCaseSchemaType = z.infer<typeof getPostsUseCaseSchema>;
