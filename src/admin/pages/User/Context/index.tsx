import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation from 'swr/mutation';
import { Role, User } from '../../../config/types.js';
import { api } from '../../../utilities/api.js';
import { UserContext } from './types.js';

const Context = createContext({} as UserContext);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getUsers = () =>
    useSWR('/users', (url) => api.get<{ users: User[] }>(url).then((res) => res.data.users), {
      suspense: true,
    });

  const getUser = (id: string) =>
    useSWR(`/users/${id}`, (url) => api.get<{ user: User }>(url).then((res) => res.data.user), {
      suspense: true,
    });

  const createUser = () =>
    useSWRMutation(`/users`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ id: number }>(url, arg).then((res) => res.data.id);
    });

  const updateUser = (id: string) =>
    useSWRMutation(`/users/${id}`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const getRoles = (config?: SWRConfiguration) =>
    useSWR(
      '/roles',
      (url) => api.get<{ roles: Role[] }>(url).then((res) => res.data.roles),
      config
    );

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
