import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Role, User } from '../../../../config/types.js';

export type UserContext = {
  getUsers: () => SWRResponse<User[]>;
  getUser: (id: string) => SWRMutationResponse<User>;
  getRoles: (config?: SWRConfiguration) => SWRResponse<Role[]>;
  createUser: () => SWRMutationResponse<number, any, string, Record<string, any>>;
  updateUser: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
};
