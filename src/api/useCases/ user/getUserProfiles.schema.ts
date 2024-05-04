import { z } from 'zod';

export const getUserProfilesUseCaseSchema = z.object({
  projectId: z.string(),
});
