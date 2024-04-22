import { z } from 'zod';

export const updateContentUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  fileId: z.string().nullable(),
  userName: z.string(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  bodyJson: z.string().nullable(),
  bodyHtml: z.string().nullable(),
});
