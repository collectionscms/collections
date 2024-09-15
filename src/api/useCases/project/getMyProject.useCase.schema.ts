import { z } from 'zod';

export const getMyProjectUseCaseSchema = z.object({
  projectId: z.string(),
});

export type GetMyProjectUseCaseSchemaType = z.infer<typeof getMyProjectUseCaseSchema>;
