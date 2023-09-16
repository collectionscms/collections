import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { User } from '../../../config/types.js';

export type ProfileContext = {
  getUser: (id: string | number | undefined) => SWRResponse<
    User,
    Error,
    {
      suspense: true;
    }
  >;
  updateUser: (id: string | number) => SWRMutationResponse<void, any, string, Record<string, any>>;
};
