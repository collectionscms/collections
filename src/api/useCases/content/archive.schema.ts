import { z } from 'zod';

export const archiveUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
});

export type ArchiveUseCaseSchemaType = z.infer<typeof archiveUseCaseSchema>;
