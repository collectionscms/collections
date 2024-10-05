import { z } from 'zod';

export const generateSeoSummaryUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type GenerateSeoSummaryUseCaseSchemaType = z.infer<typeof generateSeoSummaryUseCaseSchema>;
