import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Me } from '../../../../configs/types.js';

export type ProfileContext = {
  updateMe: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};
