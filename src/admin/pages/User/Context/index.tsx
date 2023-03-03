import React, { createContext, useContext } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { Role, User } from '../../../../shared/types';
import api from '../../../utilities/api';
import { UserContext } from './type';

const Context = createContext({} as UserContext);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getUsers = () =>
    useSWR('/users', (url) => api.get<{ users: User[] }>(url).then((res) => res.data.users));

  const getUser = (id: string, config?: SWRConfiguration) =>
    useSWR(
      `/users/${id}`,
      (url) => api.get<{ user: User }>(url).then((res) => res.data.user),
      config
    );

  const createUser = (): SWRMutationResponse =>
    useSWRMutation(`/users`, async (url: string, { arg }: { arg: string }) => {
      return api.post<{ user: User }>(url, arg).then((res) => res.data.user);
    });

  const updateUser = (id: string): SWRMutationResponse =>
    useSWRMutation(`/users/${id}`, async (url: string, { arg }: { arg: string }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const getRoles = (config?: SWRConfiguration) =>
    useSWR(
      '/roles',
      (url) => api.get<{ roles: Role[] }>(url).then((res) => res.data.roles),
      config
    );

  return (
    <Context.Provider
      value={{
        getUsers,
        getUser,
        getRoles,
        createUser,
        updateUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useUser = () => useContext(Context);
