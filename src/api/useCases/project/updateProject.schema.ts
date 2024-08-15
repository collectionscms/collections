import { z } from 'zod';

export const updateProjectUseCaseSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  sourceLanguage: z.string().optional(),
});

export type UpdateProjectUseCaseSchemaType = z.infer<typeof updateProjectUseCaseSchema>;
