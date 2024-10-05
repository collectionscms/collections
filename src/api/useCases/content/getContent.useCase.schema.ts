import { z } from 'zod';

export const getContentUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  contentId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type GetContentUseCaseSchemaType = z.infer<typeof getContentUseCaseSchema>;
