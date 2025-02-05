import { z } from 'zod';

export const getExperiencesUseCaseSchema = z.object({
  projectId: z.string().uuid(),
});

export type GetExperiencesUseCaseSchemaType = z.infer<typeof getExperiencesUseCaseSchema>;
