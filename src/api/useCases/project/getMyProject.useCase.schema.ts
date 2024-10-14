import { z } from 'zod';

export const getMyProjectUseCaseSchema = z.object({
  projectId: z.string().uuid(),
});

export type GetMyProjectUseCaseSchemaType = z.infer<typeof getMyProjectUseCaseSchema>;
