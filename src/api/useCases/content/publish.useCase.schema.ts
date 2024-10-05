import { z } from 'zod';

export const publishUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type PublishUseCaseSchemaType = z.infer<typeof publishUseCaseSchema>;
