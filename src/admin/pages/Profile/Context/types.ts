import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Me } from '../../../../configs/types.js';

export type ProfileContext = {
  getMe: () => SWRResponse<
    Me,
    Error,
    {
      suspense: true;
    }
  >;
  updateMe: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};
