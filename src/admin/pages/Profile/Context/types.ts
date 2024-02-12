import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Me } from '../../../../types/index.js';

export type ProfileContext = {
  updateMe: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};
