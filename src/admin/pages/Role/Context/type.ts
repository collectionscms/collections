import { Role } from '@shared/types';
import { SWRResponse } from 'swr';

export type RoleContext = {
  getRoles: () => SWRResponse<Role[]>;
};
