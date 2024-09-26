import { z } from 'zod';

export const getContentUseCaseSchema = z.object({
  projectId: z.string(),
  contentId: z.string(),
  userId: z.string(),
});

export type GetContentUseCaseSchemaType = z.infer<typeof getContentUseCaseSchema>;
