import React, { createContext, useContext, useMemo } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { User } from '../../../config/types.js';
import { api } from '../../../utilities/api.js';
import { ProfileContext } from './types.js';

const Context = createContext({} as ProfileContext);

export const ProfileContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getUser = (id: string | number | undefined) =>
    useSWR(
      id ? `/users/${id}` : null,
      (url) => api.get<{ user: User }>(url).then((res) => res.data.user),
      {
        suspense: true,
      }
    );

  const updateUser = (id: string | number) =>
    useSWRMutation(`/users/${id}`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getUser,
      updateUser,
    }),
    [getUser, updateUser]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useProfile = () => useContext(Context);
