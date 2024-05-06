import { User } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { api } from '../../../utilities/api.js';

type ProfileContext = {
  getProfile: () => SWRResponse<
    User,
    Error,
    {
      suspense: true;
    }
  >;
  updateMe: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};

const Context = createContext({} as ProfileContext);

export const ProfileContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getProfile = () =>
    useSWR('/me/profile', (url) => api.get<{ user: User }>(url).then((res) => res.data.user), {
      suspense: true,
    });

  const updateMe = () =>
    useSWRMutation('/me', async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getProfile,
      updateMe,
    }),
    [getProfile, updateMe]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useProfile = () => useContext(Context);
