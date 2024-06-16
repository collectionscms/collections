import { z } from 'zod';

export const getPostsUseCaseSchema = z.object({
  projectId: z.string(),
  defaultLocale: z.string(),
});

export type GetPostsUseCaseSchemaType = z.infer<typeof getPostsUseCaseSchema>;
