import { z } from 'zod';

export const trashPostUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
});

export type TrashPostUseCaseSchemaType = z.infer<typeof trashPostUseCaseSchema>;
