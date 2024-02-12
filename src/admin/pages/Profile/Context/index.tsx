import React, { createContext, useContext, useMemo } from 'react';
import useSWRMutation from 'swr/mutation';
import { api } from '../../../utilities/api.js';
import { ProfileContext } from './types.js';

const Context = createContext({} as ProfileContext);

export const ProfileContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const updateMe = () =>
    useSWRMutation('/me', async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      updateMe,
    }),
    [updateMe]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useProfile = () => useContext(Context);
