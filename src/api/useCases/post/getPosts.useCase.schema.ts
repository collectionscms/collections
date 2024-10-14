import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const getPostsUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  sourceLanguage: z.nativeEnum(IsoLanguageCode),
  userId: z.string().uuid(),
  isAdmin: z.boolean(),
  permissions: z.array(
    z.object({
      action: z.string(),
    })
  ),
});

export type GetPostsUseCaseSchemaType = z.infer<typeof getPostsUseCaseSchema>;
