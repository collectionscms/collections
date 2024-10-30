import { z } from 'zod';

export const createContentTagsUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  names: z.array(z.string()),
});

export type CreateContentTagsUseCaseSchemaType = z.infer<typeof createContentTagsUseCaseSchema>;
