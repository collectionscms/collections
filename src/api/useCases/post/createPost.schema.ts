import { z } from 'zod';
import { LanguageCodes } from '../../../constants/languages.js';

export const createPostUseCaseSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  sourceLanguage: z.nativeEnum(LanguageCodes),
});

export type CreatePostUseCaseSchemaType = z.infer<typeof createPostUseCaseSchema>;
