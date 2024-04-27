import React, { createContext, useContext, useMemo } from 'react';
import useSWRMutation from 'swr/mutation';
import { api } from '../../../utilities/api.js';
import { ResetPasswordContext } from './types.js';

const Context = createContext({} as ResetPasswordContext);

export const ResetPasswordContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const resetPassword = () =>
    useSWRMutation(
      '/me/reset-password',
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ message: string }>(url, arg).then((res) => res.data.message);
      }
    );

  const value = useMemo(
    () => ({
      resetPassword,
    }),
    [resetPassword]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useResetPassword = () => useContext(Context);
