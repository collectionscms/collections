import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Role, User } from '../../../../shared/types';

export type UserContext = {
  getUsers: () => SWRResponse<User[]>;
  getUser: (id: string, config?: SWRConfiguration) => SWRResponse<User>;
  getRoles: (config?: SWRConfiguration) => SWRResponse<Role[]>;
  createUser: () => SWRMutationResponse<User, any, Record<string, any>, any>;
  updateUser: (id: string) => SWRMutationResponse<void, any, Record<string, any>, any>;
};
