import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const getPostUseCaseSchema = z.object({
  projectId: z.string(),
  postId: z.string(),
  userId: z.string(),
  language: z.nativeEnum(IsoLanguageCode),
});

export type GetPostUseCaseSchemaType = z.infer<typeof getPostUseCaseSchema>;
