import { AuthUser, Permission, PermissionsAction } from '@shared/types';
import { SWRMutationResponse } from 'swr/mutation';

export type AuthContext<T = AuthUser> = {
  user?: T | null;
  permissions: Permission[];
  setToken: (token: string) => void;
  hasPermission: (collection: string, action: PermissionsAction) => boolean;
  login: () => SWRMutationResponse<string>;
};
