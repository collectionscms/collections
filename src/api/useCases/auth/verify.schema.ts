import { z } from 'zod';

export const verifyUseCaseSchema = z.object({
  token: z.string(),
});

export type VerifyUseCaseSchemaType = z.infer<typeof verifyUseCaseSchema>;
