import { z } from 'zod';
import { isValidUrl } from '../../utilities/isValidUrl.js';

export const createExperienceUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  experiences: z.array(
    z.object({
      id: z.string().nullable().optional(),
      name: z.string(),
      url: z.string().nullable().refine(isValidUrl, { message: 'Invalid URL' }),
      resourceUrls: z.array(z.string().nullable().refine(isValidUrl, { message: 'Invalid URL' })),
    })
  ),
});

export type CreateExperienceUseCaseSchemaType = z.infer<typeof createExperienceUseCaseSchema>;
