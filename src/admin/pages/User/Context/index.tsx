import { Role } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { UserProfile } from '../../../../types/index.js';
import { api } from '../../../utilities/api.js';

type UserContext = {
  getUsers: () => SWRResponse<
    UserProfile[],
    Error,
    {
      suspense: true;
    }
  >;
  getUser: (id: string) => SWRResponse<
    UserProfile,
    Error,
    {
      suspense: true;
    }
  >;
  getRoles: () => SWRResponse<
    Role[],
    Error,
    {
      suspense: true;
    }
  >;
  createUser: () => SWRMutationResponse<number, any, string, Record<string, any>>;
  updateUser: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
};

const Context = createContext({} as UserContext);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getUsers = () =>
    useSWR(
      '/users',
      (url) => api.get<{ users: UserProfile[] }>(url).then((res) => res.data.users),
      {
        suspense: true,
      }
    );

  const getUser = (id: string) =>
    useSWR(
      `/users/${id}`,
      (url) => api.get<{ user: UserProfile }>(url).then((res) => res.data.user),
      {
        suspense: true,
      }
    );

  const createUser = () =>
    useSWRMutation(`/users`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ id: number }>(url, arg).then((res) => res.data.id);
    });

  const updateUser = (id: string) =>
    useSWRMutation(`/users/${id}`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const getRoles = () =>
    useSWR('/roles', (url) => api.get<{ roles: Role[] }>(url).then((res) => res.data.roles), {
      suspense: true,
    });

  const value = useMemo(
    () => ({
      getUsers,
      getUser,
      getRoles,
      createUser,
      updateUser,
    }),
    [getUsers, getUser, getRoles, createUser, updateUser]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);
