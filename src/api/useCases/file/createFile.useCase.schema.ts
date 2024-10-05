import { z } from 'zod';

export const createFileUseCaseSchema = z.object({
  projectId: z.string().uuid().nullable(),
});
