import { z } from 'zod';
import { IsoLanguageCode } from '../../../../constants/languages.js';

export const createContentUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  sourceLanguage: z.nativeEnum(IsoLanguageCode),
  body: z.string(),
  bodyJson: z.string(),
  bodyHtml: z.string(),
});

export type CreateContentUseCaseSchemaType = z.infer<typeof createContentUseCaseSchema>;
