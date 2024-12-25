import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const getTagPublishedListContentsUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  language: z.nativeEnum(IsoLanguageCode).optional(),
  name: z.string(),
});
export type GetTagPublishedListContentsUseCaseSchemaType = z.infer<
  typeof getTagPublishedListContentsUseCaseSchema
>;
