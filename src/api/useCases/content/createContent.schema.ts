import { z } from 'zod';

export const createContentUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  locale: z.string(),
  userId: z.string(),
});

export type CreateContentUseCaseSchemaType = z.infer<typeof createContentUseCaseSchema>;
