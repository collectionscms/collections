import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const createContentUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  language: z.nativeEnum(IsoLanguageCode),
  userId: z.string().uuid(),
});

export type CreateContentUseCaseSchemaType = z.infer<typeof createContentUseCaseSchema>;
