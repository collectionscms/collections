import { z } from 'zod';

export const getUserPublishedListContentsUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  id: z.string().uuid(),
});

export type GetUserPublishedListContentsUseCaseSchemaType = z.infer<
  typeof getUserPublishedListContentsUseCaseSchema
>;
