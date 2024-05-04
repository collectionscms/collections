import { z } from 'zod';

export const getRolesUseCaseSchema = z.object({
  projectId: z.string(),
});
