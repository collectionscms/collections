import { z } from 'zod';

export const trashContentUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type TrashContentUseCaseSchemaType = z.infer<typeof trashContentUseCaseSchema>;
