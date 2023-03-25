import React, { createContext, useContext, useMemo } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import api from '../../../utilities/api';
import { ForgotPasswordContext } from './types';

const Context = createContext({} as ForgotPasswordContext);

export const ForgotPasswordContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const forgotPassword = (): SWRMutationResponse =>
    useSWRMutation('/users/forgot-password', async (url: string, { arg }: { arg: string }) => {
      return api.post<{ message: string }>(url, arg).then((res) => res.data.message);
    });

  const value = useMemo(
    () => ({
      forgotPassword,
    }),
    [forgotPassword]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useForgotPassword = () => useContext(Context);
