import { z } from 'zod';

export const trashPostUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type TrashPostUseCaseSchemaType = z.infer<typeof trashPostUseCaseSchema>;
