import { z } from 'zod';

export const revertContentUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  contentRevisionId: z.string().uuid(),
});

export type RevertContentUseCaseSchemaType = z.infer<typeof revertContentUseCaseSchema>;
