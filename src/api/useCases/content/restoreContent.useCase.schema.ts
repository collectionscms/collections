import { z } from 'zod';

export const restoreContentUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type RestoreContentUseCaseSchemaType = z.infer<typeof restoreContentUseCaseSchema>;
