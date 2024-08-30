import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const trashLanguageContentUseCaseSchema = z.object({
  postId: z.string(),
  projectId: z.string(),
  userId: z.string(),
  language: z.nativeEnum(IsoLanguageCode),
});

export type TrashLanguageContentUseCaseSchemaType = z.infer<
  typeof trashLanguageContentUseCaseSchema
>;
