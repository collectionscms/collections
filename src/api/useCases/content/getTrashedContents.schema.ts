import { z } from 'zod';

export const getTrashedContentsUseCaseSchema = z.object({
  projectId: z.string(),
});

export type GetTrashedContentsUseCaseSchemaType = z.infer<typeof getTrashedContentsUseCaseSchema>;
