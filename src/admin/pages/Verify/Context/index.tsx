import React, { createContext, useContext, useMemo } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { api } from '../../../utilities/api.js';

export type VerifyUpContext = {
  verify: () => SWRMutationResponse<void, Error, string, Record<string, any>>;
};

const Context = createContext({} as VerifyUpContext);

export const VerifyContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const verify = () =>
    useSWRMutation('/verify', async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      verify,
    }),
    [verify]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useVerify = () => useContext(Context);
