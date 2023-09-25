import { SWRMutationResponse } from 'swr/mutation';
import { AuthUser, Permission, PermissionsAction } from '../../../config/types.js';

export type AuthContext<T = AuthUser> = {
  user: T | null | undefined;
  apiKey?: string | null;
  token?: string;
  permissions: Permission[] | null;
  hasPermission: (modelId: string, action: PermissionsAction) => boolean;
  login: () => SWRMutationResponse<
    { token: string; user: AuthUser },
    any,
    string,
    Record<string, any>
  >;
  logout: () => SWRMutationResponse;
  updateApiKey: (key: string) => void;
};
