import { z } from 'zod';

export const getSubdomainAvailabilityUseCaseSchema = z.object({
  subdomain: z.string().regex(/^[a-z0-9-]+$/, `Alphanumeric characters and symbols '-'`),
});

export type GetSubdomainAvailabilityUseCaseSchemaType = z.infer<
  typeof getSubdomainAvailabilityUseCaseSchema
>;
