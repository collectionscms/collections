import { z } from 'zod';

export const getDataUseCaseSchema = z.object({
  fileId: z.string().uuid(),
  subdomain: z.string(),
});
