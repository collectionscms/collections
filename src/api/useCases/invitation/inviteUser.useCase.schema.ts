import { z } from 'zod';

export const inviteUserUseCaseSchema = z.object({
  projectId: z.string(),
  email: z.string().email(),
  roleId: z.string(),
  invitedById: z.string(),
});

export type InviteUserUseCaseSchemaType = z.infer<typeof inviteUserUseCaseSchema>;
