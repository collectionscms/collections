import React, { createContext, useContext, useMemo } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { api } from '../../../utilities/api.js';

type ForgotPasswordContext = {
  forgotPassword: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};

const Context = createContext({} as ForgotPasswordContext);

export const ForgotPasswordContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const forgotPassword = () =>
    useSWRMutation(
      '/me/forgot-password',
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post(url, arg).then((res) => res.data);
      }
    );

  const value = useMemo(
    () => ({
      forgotPassword,
    }),
    [forgotPassword]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useForgotPassword = () => useContext(Context);
