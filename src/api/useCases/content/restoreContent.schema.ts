import { z } from 'zod';

export const restoreContentUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
});

export type RestoreContentUseCaseSchemaType = z.infer<typeof restoreContentUseCaseSchema>;
