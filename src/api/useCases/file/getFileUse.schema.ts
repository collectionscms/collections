import { z } from 'zod';

export const getFileUseCaseSchema = z.object({
  fileId: z.string(),
  projectId: z.string(),
});
