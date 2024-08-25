import { z } from 'zod';
import { LanguageCodes } from '../../../constants/languages.js';

export const trashLanguageContentUseCaseSchema = z.object({
  postId: z.string(),
  projectId: z.string(),
  userId: z.string(),
  language: z.nativeEnum(LanguageCodes),
});

export type TrashLanguageContentUseCaseSchemaType = z.infer<
  typeof trashLanguageContentUseCaseSchema
>;
