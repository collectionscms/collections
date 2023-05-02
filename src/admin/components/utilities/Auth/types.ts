import { SWRMutationResponse } from 'swr/mutation';
import { AuthUser, Permission, PermissionsAction, Token } from '../../../../config/types.js';

export type AuthContext<T = AuthUser> = {
  user?: T | null;
  permissions: Permission[] | null;
  setToken: (token: string) => void;
  hasPermission: (collection: string, action: PermissionsAction) => boolean;
  login: () => SWRMutationResponse<Token, any, Record<string, any>, any>;
  logout: () => void;
};
