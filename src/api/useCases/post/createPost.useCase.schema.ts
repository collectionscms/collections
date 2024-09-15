import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const createPostUseCaseSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
  sourceLanguage: z.nativeEnum(IsoLanguageCode),
});

export type CreatePostUseCaseSchemaType = z.infer<typeof createPostUseCaseSchema>;
