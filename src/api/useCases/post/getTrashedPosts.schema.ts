import { z } from 'zod';

export const getTrashedPostsUseCaseSchema = z.object({
  projectId: z.string(),
  primaryLocale: z.string(),
});

export type GetTrashedPostsUseCaseSchemaType = z.infer<typeof getTrashedPostsUseCaseSchema>;
