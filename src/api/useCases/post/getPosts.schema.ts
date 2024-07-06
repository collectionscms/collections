import { z } from 'zod';

export const getPostsUseCaseSchema = z.object({
  projectId: z.string(),
  primaryLocale: z.string(),
});

export type GetPostsUseCaseSchemaType = z.infer<typeof getPostsUseCaseSchema>;
