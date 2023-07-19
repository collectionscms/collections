import { SWRMutationResponse } from 'swr/mutation';

export type ForgotPasswordContext = {
  forgotPassword: () => SWRMutationResponse<string, any, string, Record<string, any>>;
};
