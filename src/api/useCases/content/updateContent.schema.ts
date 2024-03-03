import { z } from 'zod';

export const updateContentUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userName: z.string(),
  title: z.string(),
  body: z.string(),
  bodyJson: z.string(),
  bodyHtml: z.string(),
});
