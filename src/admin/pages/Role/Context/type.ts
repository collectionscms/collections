import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Role } from '../../../../shared/types';

export type RoleContext = {
  getRoles: () => SWRResponse<Role[]>;
  createRole: () => SWRMutationResponse<Role>;
};
