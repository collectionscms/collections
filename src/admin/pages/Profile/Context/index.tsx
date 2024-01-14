import React, { createContext, useContext, useMemo } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { Me } from '../../../../configs/types.js';
import { api } from '../../../utilities/api.js';
import { ProfileContext } from './types.js';

const Context = createContext({} as ProfileContext);

export const ProfileContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getMe = () =>
    useSWR('/me', (url) => api.get<Me>(url).then((res) => res.data), {
      suspense: true,
    });

  const updateMe = () =>
    useSWRMutation('/me', async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getMe,
      updateMe,
    }),
    [getMe, updateMe]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useProfile = () => useContext(Context);
