import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Collection, Permission, Role } from '../../../config/types.js';

export type RoleContext = {
  getRoles: () => SWRResponse<
    Role[],
    Error,
    {
      suspense: true;
    }
  >;
  getRole: (id: string) => SWRResponse<
    Role,
    Error,
    {
      suspense: true;
    }
  >;
  createRole: () => SWRMutationResponse<number, any, string, Record<string, any>>;
  updateRole: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  getCollections: (config?: SWRConfiguration) => SWRResponse<Collection[]>;
  getPermissions: (id: string, config?: SWRConfiguration) => SWRResponse<Permission[]>;
  createPermission: (
    id: string
  ) => SWRMutationResponse<Permission, any, string, Record<string, any>>;
  deletePermission: (id: string, permissionId: string) => SWRMutationResponse;
};
