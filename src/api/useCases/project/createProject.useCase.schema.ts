import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const createProjectUseCaseSchema = z.object({
  userId: z.string().uuid(),
  name: z.string(),
  sourceLanguage: z.nativeEnum(IsoLanguageCode),
  subdomain: z.string().regex(/^[a-z0-9-]+$/, `Alphanumeric characters and symbols '-'`),
});

export type CreateProjectUseCaseSchemaType = z.infer<typeof createProjectUseCaseSchema>;
