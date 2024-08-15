import { z } from 'zod';

export const getPublishedPostsUseCaseSchema = z.object({
  projectId: z.string(),
  sourceLanguage: z.string(),
  language: z.string().optional(),
});

export type GetPublishedPostsUseCaseSchemaType = z.infer<typeof getPublishedPostsUseCaseSchema>;
