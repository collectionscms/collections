import { z } from 'zod';

export const signInWithAcceptInvitationUseCaseSchema = z.object({
  inviteToken: z.string(),
  userId: z.string().uuid(),
});

export type SignInWithAcceptInvitationUseCaseSchemaType = z.infer<
  typeof signInWithAcceptInvitationUseCaseSchema
>;
