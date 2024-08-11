import { z } from 'zod';

export const trashLocaleContentUseCaseSchema = z.object({
  postId: z.string(),
  projectId: z.string(),
  userId: z.string(),
  locale: z.string(),
});

export type TrashLocaleContentUseCaseSchemaType = z.infer<typeof trashLocaleContentUseCaseSchema>;
