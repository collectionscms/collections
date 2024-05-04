import { z } from 'zod';

export const getDataUseCaseSchema = z.object({
  fileId: z.string(),
  subdomain: z.string(),
});
