import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const createContentUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  language: z.nativeEnum(IsoLanguageCode),
  userId: z.string(),
});

export type CreateContentUseCaseSchemaType = z.infer<typeof createContentUseCaseSchema>;
