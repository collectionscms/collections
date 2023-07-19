import { SWRMutationResponse } from 'swr/mutation';

export type ResetPasswordContext = {
  resetPassword: () => SWRMutationResponse<string, any, string, Record<string, any>>;
};
