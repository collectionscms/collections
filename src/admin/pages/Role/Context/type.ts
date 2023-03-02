import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Collection, Permission, Role } from '../../../../shared/types';

export type RoleContext = {
  getRoles: () => SWRResponse<Role[]>;
  getRole: (id: string, config?: SWRConfiguration) => SWRResponse<Role>;
  createRole: () => SWRMutationResponse<Role, any, Record<string, any>, any>;
  updateRole: (id: string) => SWRMutationResponse;
  getCollections: (config?: SWRConfiguration) => SWRResponse<Collection[]>;
  getPermissions: (id: string, config?: SWRConfiguration) => SWRResponse<Permission[]>;
  createPermission: (id: string) => SWRMutationResponse<Permission>;
  deletePermission: (id: string, permissionId: string) => SWRMutationResponse;
};
