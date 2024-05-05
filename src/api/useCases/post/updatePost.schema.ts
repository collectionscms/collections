import { z } from 'zod';

export const updatePostUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  status: z.string(),
});

export type UpdatePostUseCaseSchemaType = z.infer<typeof updatePostUseCaseSchema>;
