import { z } from 'zod';

export const updatePostUseCaseSchema = z.object({
  projectId: z.string(),
  postId: z.string(),
  slug: z.string(),
});

export type UpdatePostUseCaseSchemaType = z.infer<typeof updatePostUseCaseSchema>;
