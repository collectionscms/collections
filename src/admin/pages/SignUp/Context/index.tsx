import React, { createContext, useContext, useMemo } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { Me } from '../../../../types/index.js';
import { api } from '../../../utilities/api.js';

export type SignUpContext = {
  signUp: () => SWRMutationResponse<Me, any, string, Record<string, any>>;
};

const Context = createContext({} as SignUpContext);

export const SignUpContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const signUp = () =>
    useSWRMutation('/sign-up', async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ me: Me }>(url, arg).then((res) => res.data.me);
    });

  const value = useMemo(
    () => ({
      signUp,
    }),
    [signUp]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useSignUp = () => useContext(Context);
