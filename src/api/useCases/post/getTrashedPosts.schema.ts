import { z } from 'zod';

export const getTrashedPostsUseCaseSchema = z.object({
  projectId: z.string(),
  defaultLocale: z.string(),
});

export type GetTrashedPostsUseCaseSchemaType = z.infer<typeof getTrashedPostsUseCaseSchema>;
