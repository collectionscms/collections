import React, { createContext, useContext } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { Collection, Permission, Role } from '../../../../shared/types';
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

  const getPermissions = (id: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/roles/${id}/permissions`,
      (url) =>
        api
          .get<{ permissions: Permission[] }>(url)
          .then((res) => res.data.permissions)
          .catch((err) => Promise.reject(err.message)),
      config
    );

  const createPermission = (id: string): SWRMutationResponse =>
    useSWRMutation(`/roles/${id}/permissions`, async (url: string, { arg }) => {
      return api
        .post<{ permission: Permission }>(url, arg)
        .then((res) => res.data.permission)
        .catch((err) => Promise.reject(err.message));
    });

  const deletePermission = (id: string, permissionId: string): SWRMutationResponse =>
    useSWRMutation(`/roles/${id}/permissions/${permissionId}`, async (url: string, { arg }) => {
      return api
        .delete(url, arg)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err.message));
    });

  return (
    <Context.Provider
      value={{
        getRoles,
        getRole,
        createRole,
        updateRole,
        getCollections,
        getPermissions,
        createPermission,
        deletePermission,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useRole = () => useContext(Context);
