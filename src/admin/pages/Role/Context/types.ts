import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Model, Permission, Role } from '../../../config/types.js';

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
  getModels: () => SWRResponse<
    Model[],
    Error,
    {
      suspense: true;
    }
  >;
  getPermissions: (id: string) => SWRResponse<
    Permission[],
    Error,
    {
      suspense: true;
    }
  >;
  createPermission: (id: string) => SWRMutationResponse<number, any, string, Record<string, any>>;
  deletePermission: (id: string, permissionId: string) => SWRMutationResponse;
};
