import { z } from 'zod';

export const trashLanguageContentUseCaseSchema = z.object({
  postId: z.string(),
  projectId: z.string(),
  userId: z.string(),
  language: z.string(),
});

export type TrashLanguageContentUseCaseSchemaType = z.infer<
  typeof trashLanguageContentUseCaseSchema
>;
