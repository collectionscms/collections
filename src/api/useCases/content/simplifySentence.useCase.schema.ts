import { z } from 'zod';

export const simplifySentenceUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  text: z.string(),
});

export type SimplifySentenceUseCaseSchemaType = z.infer<typeof simplifySentenceUseCaseSchema>;
