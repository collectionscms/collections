import { SWRMutationResponse } from 'swr/mutation';

export type ForgotPasswordContext = {
  forgotPassword: () => SWRMutationResponse<string, any, Record<string, any>, any>;
};
