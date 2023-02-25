import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Collection, Role } from '../../../../shared/types';

export type RoleContext = {
  getRoles: () => SWRResponse<Role[]>;
  getRole: (id: string, config?: SWRConfiguration) => SWRResponse<Role>;
  createRole: () => SWRMutationResponse<Role>;
  updateRole: (id: string) => SWRMutationResponse;
  getCollections: (config?: SWRConfiguration) => SWRResponse<Collection[]>;
};
