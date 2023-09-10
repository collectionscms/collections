import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Role, User } from '../../../config/types.js';

export type UserContext = {
  getUsers: () => SWRResponse<
    User[],
    Error,
    {
      suspense: true;
    }
  >;
  getUser: (id: string) => SWRResponse<
    User,
    Error,
    {
      suspense: true;
    }
  >;
  getRoles: (config?: SWRConfiguration) => SWRResponse<Role[]>;
  createUser: () => SWRMutationResponse<number, any, string, Record<string, any>>;
  updateUser: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
};
