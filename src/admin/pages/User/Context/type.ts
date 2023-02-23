import { Role, User } from '@shared/types';
import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';

export type UserContext = {
  getUsers: () => SWRResponse<User[]>;
  getUser: (id: string, config?: SWRConfiguration) => SWRResponse<User>;
  getRoles: (config?: SWRConfiguration) => SWRResponse<Role[]>;
  createUser: () => SWRMutationResponse<User>;
};
