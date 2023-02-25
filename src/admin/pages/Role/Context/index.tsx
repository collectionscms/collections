import React, { createContext, useContext } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { Collection, Role } from '../../../../shared/types';
import api from '../../../utilities/api';
import { RoleContext } from './type';

const Context = createContext({} as RoleContext);

export const RoleContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getRoles = () =>
    useSWR('/roles', (url) =>
      api
        .get<{ roles: Role[] }>(url)
        .then((res) => res.data.roles)
        .catch((err) => Promise.reject(err.message))
    );

  const getRole = (id: string, config?: SWRConfiguration) =>
    useSWR(
      `/roles/${id}`,
      (url) =>
        api
          .get<{ role: Role }>(url)
          .then((res) => res.data.role)
          .catch((err) => Promise.reject(err.message)),
      config
    );

  const createRole = (): SWRMutationResponse =>
    useSWRMutation(`/roles`, async (url: string, { arg }) => {
      return api
        .post<{ role: Role }>(url, arg)
        .then((res) => res.data.role)
        .catch((err) => Promise.reject(err.message));
    });

  const updateRole = (id: string): SWRMutationResponse =>
    useSWRMutation(`/roles/${id}`, async (url: string, { arg }) => {
      return api
        .patch(url, arg)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err.message));
    });

  const getCollections = (config?: SWRConfiguration): SWRResponse =>
    useSWR(
      '/collections',
      (url) =>
        api
          .get<{ collections: Collection[] }>(url)
          .then((res) => res.data.collections)
          .catch((err) => Promise.reject(err.message)),
      config
    );

  return (
    <Context.Provider
      value={{
        getRoles,
        getRole,
        createRole,
        updateRole,
        getCollections,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useRole = () => useContext(Context);
