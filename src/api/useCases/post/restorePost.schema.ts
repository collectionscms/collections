import { z } from 'zod';

export const restorePostUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
});

export type RestorePostUseCaseSchemaType = z.infer<typeof restorePostUseCaseSchema>;
