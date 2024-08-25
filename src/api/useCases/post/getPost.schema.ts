import { z } from 'zod';
import { LanguageCodes } from '../../../constants/languages.js';

export const getPostUseCaseSchema = z.object({
  projectId: z.string(),
  postId: z.string(),
  userId: z.string(),
  language: z.nativeEnum(LanguageCodes),
});

export type GetPostUseCaseSchemaType = z.infer<typeof getPostUseCaseSchema>;
