import { z } from 'zod';

export const generateSeoSummaryUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
});

export type GenerateSeoSummaryUseCaseSchemaType = z.infer<typeof generateSeoSummaryUseCaseSchema>;
