import { z } from 'zod';

export const completeSentenceUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  text: z.string(),
});

export type CompleteSentenceUseCaseSchemaType = z.infer<typeof completeSentenceUseCaseSchema>;
