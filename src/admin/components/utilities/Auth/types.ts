import { Permission } from '@prisma/client';
import { SWRMutationResponse } from 'swr/mutation';
import { AuthUser } from '../../../../configs/types.js';

export type AuthContext<T = AuthUser> = {
  user: T | null | undefined;
  apiKey?: string | null;
  token?: string;
  permissions: Permission[] | null;
  login: () => SWRMutationResponse<
    { token: string; user: AuthUser },
    any,
    string,
    Record<string, any>
  >;
  logout: () => SWRMutationResponse;
  updateApiKey: (key: string) => void;
};
