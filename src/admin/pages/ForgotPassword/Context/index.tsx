import React, { createContext, useContext, useMemo } from 'react';
import useSWRMutation from 'swr/mutation';
import { api } from '../../../utilities/api.js';
import { ForgotPasswordContext } from './types.js';

const Context = createContext({} as ForgotPasswordContext);

export const ForgotPasswordContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const forgotPassword = () =>
    useSWRMutation(
      '/me/forgot-password',
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ message: string }>(url, arg).then((res) => res.data.message);
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
