import { z } from 'zod';

export const publishUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
});

export type PublishUseCaseSchemaType = z.infer<typeof publishUseCaseSchema>;
