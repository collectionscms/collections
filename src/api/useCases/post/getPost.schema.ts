import { z } from 'zod';

export const getPostUseCaseSchema = z.object({
  projectId: z.string(),
  postId: z.string(),
  defaultLocale: z.string(),
});

export type GetPostUseCaseSchemaType = z.infer<typeof getPostUseCaseSchema>;
