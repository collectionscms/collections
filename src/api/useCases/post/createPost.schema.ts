import { z } from 'zod';

export const createPostUseCaseSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  primaryLocale: z.string(),
});

export type CreatePostUseCaseSchemaType = z.infer<typeof createPostUseCaseSchema>;
