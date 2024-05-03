import { z } from 'zod';

export const deletePostUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
});

export type DeletePostUseCaseSchemaType = z.infer<typeof deletePostUseCaseSchema>;
