import { SWRMutationResponse } from 'swr/mutation';
import { AuthUser, Permission, PermissionsAction } from '../../../../config/types.js';

export type AuthContext<T = AuthUser> = {
  user: T | null | undefined;
  permissions: Permission[] | null;
  hasPermission: (collection: string, action: PermissionsAction) => boolean;
  login: () => SWRMutationResponse<
    { token: string; user: AuthUser; exp: number },
    any,
    Record<string, any>,
    any
  >;
  logout: () => SWRMutationResponse;
};
