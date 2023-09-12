import { SWRResponse } from 'swr';
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
  getRoles: () => SWRResponse<
    Role[],
    Error,
    {
      suspense: true;
    }
  >;
  createUser: () => SWRMutationResponse<number, any, string, Record<string, any>>;
  updateUser: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
};
