import { z } from 'zod';

export const generateSummaryUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type GenerateSummaryUseCaseSchemaType = z.infer<typeof generateSummaryUseCaseSchema>;
