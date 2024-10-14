import { z } from 'zod';

export const generateSeoUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type GenerateSeoUseCaseSchemaType = z.infer<typeof generateSeoUseCaseSchema>;
