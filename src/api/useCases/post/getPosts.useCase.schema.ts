import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const getPostsUseCaseSchema = z.object({
  projectId: z.string(),
  sourceLanguage: z.nativeEnum(IsoLanguageCode),
  userId: z.string(),
});

export type GetPostsUseCaseSchemaType = z.infer<typeof getPostsUseCaseSchema>;
