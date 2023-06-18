import { SWRMutationResponse } from 'swr/mutation';
import { AuthUser, Permission, PermissionsAction } from '../../../../config/types.js';

export type AuthContext<T = AuthUser> = {
  user: T | null | undefined;
  token?: string;
  permissions: Permission[] | null;
  hasPermission: (collection: string, action: PermissionsAction) => boolean;
  login: () => SWRMutationResponse<
    { token: string; user: AuthUser },
    any,
    Record<string, any>,
    any
  >;
  logout: () => SWRMutationResponse;
};
