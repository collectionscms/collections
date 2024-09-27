import { z } from 'zod';

export const revertContentUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  contentRevisionId: z.string(),
});

export type RevertContentUseCaseSchemaType = z.infer<typeof revertContentUseCaseSchema>;
