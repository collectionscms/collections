import { z } from 'zod';

export const forgotPasswordUseCaseSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordUseCaseSchemaType = z.infer<typeof forgotPasswordUseCaseSchema>;
