import { z } from 'zod';

export const trashContentUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
});

export type TrashContentUseCaseSchemaType = z.infer<typeof trashContentUseCaseSchema>;
