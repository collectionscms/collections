import React, { createContext, useContext, useMemo } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import api from '../../../utilities/api';
import { ResetPasswordContext } from './types';

const Context = createContext({} as ResetPasswordContext);

export const ResetPasswordContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const resetPassword = (): SWRMutationResponse =>
    useSWRMutation('/users/reset-password', async (url: string, { arg }: { arg: string }) => {
      return api.post<{ message: string }>(url, arg).then((res) => res.data.message);
    });

  const value = useMemo(
    () => ({
      resetPassword,
    }),
    [resetPassword]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useResetPassword = () => useContext(Context);
