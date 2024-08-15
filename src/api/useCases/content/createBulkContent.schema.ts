import { z } from 'zod';

export const createBulkContentUseCaseSchema = z.object({
  postId: z.string(),
  projectId: z.string(),
  userId: z.string(),
  languages: z.array(z.string()),
});

export type CreateBulkContentUseCaseSchemaType = z.infer<typeof createBulkContentUseCaseSchema>;
