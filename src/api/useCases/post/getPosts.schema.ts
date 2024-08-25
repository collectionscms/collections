import { z } from 'zod';
import { LanguageCodes } from '../../../constants/languages.js';

export const getPostsUseCaseSchema = z.object({
  projectId: z.string(),
  sourceLanguage: z.nativeEnum(LanguageCodes),
  userId: z.string(),
});

export type GetPostsUseCaseSchemaType = z.infer<typeof getPostsUseCaseSchema>;
