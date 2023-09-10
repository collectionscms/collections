import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { Collection, Permission, Role } from '../../../config/types.js';
import { api } from '../../../utilities/api.js';
import { RoleContext } from './types.js';

const Context = createContext({} as RoleContext);

export const RoleContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getRoles = () =>
    useSWR('/roles', (url) => api.get<{ roles: Role[] }>(url).then((res) => res.data.roles), {
      suspense: true,
    });

  const getRole = (id: string) =>
    useSWR(`/roles/${id}`, (url) => api.get<{ role: Role }>(url).then((res) => res.data.role), {
      suspense: true,
    });

  const createRole = () =>
    useSWRMutation(`/roles`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ id: number }>(url, arg).then((res) => res.data.id);
    });

  const updateRole = (id: string) =>
    useSWRMutation(`/roles/${id}`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const getCollections = (config?: SWRConfiguration): SWRResponse =>
    useSWR(
      '/collections',
      (url) => api.get<{ collections: Collection[] }>(url).then((res) => res.data.collections),
      config
    );

  const getPermissions = (id: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/roles/${id}/permissions`,
      (url) => api.get<{ permissions: Permission[] }>(url).then((res) => res.data.permissions),
      config
    );

  const createPermission = (id: string) =>
    useSWRMutation(
      `/roles/${id}/permissions`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ permission: Permission }>(url, arg).then((res) => res.data.permission);
      }
    );

  const deletePermission = (id: string, permissionId: string): SWRMutationResponse =>
    useSWRMutation(`/roles/${id}/permissions/${permissionId}`, async (url: string, { arg }) => {
      return api.delete(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getRoles,
      getRole,
      createRole,
      updateRole,
      getCollections,
      getPermissions,
      createPermission,
      deletePermission,
    }),
    [
      getRoles,
      getRole,
      createRole,
      updateRole,
      getCollections,
      getPermissions,
      createPermission,
      deletePermission,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useRole = () => useContext(Context);
