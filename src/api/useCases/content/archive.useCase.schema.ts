import { z } from 'zod';

export const archiveUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type ArchiveUseCaseSchemaType = z.infer<typeof archiveUseCaseSchema>;
