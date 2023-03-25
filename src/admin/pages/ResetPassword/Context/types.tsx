import { SWRMutationResponse } from 'swr/mutation';

export type ResetPasswordContext = {
  resetPassword: () => SWRMutationResponse<string, any, Record<string, any>, any>;
};
