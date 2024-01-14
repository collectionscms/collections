import { Role, User } from '@prisma/client';
import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';

export type UserContext = {
  getUsers: () => SWRResponse<
    User & { role: Role }[],
    Error,
    {
      suspense: true;
    }
  >;
  getUser: (id: string) => SWRResponse<
    User & { role: Role },
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
