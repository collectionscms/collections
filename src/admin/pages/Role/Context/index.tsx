import { Role } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { RoleWithPermissions } from '../../../../types/index.js';
import { api } from '../../../utilities/api.js';

type RoleContext = {
  getRoles: () => SWRResponse<
    Role[],
    Error,
    {
      suspense: true;
    }
  >;
  getRole: (id: string) => SWRResponse<
    RoleWithPermissions,
    Error,
    {
      suspense: true;
    }
  >;
  createRole: () => SWRMutationResponse<number, any, string, Record<string, any>>;
  updateRole: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
};

const Context = createContext({} as RoleContext);

export const RoleContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getRoles = () =>
    useSWR('/roles', (url) => api.get<{ roles: Role[] }>(url).then((res) => res.data.roles), {
      suspense: true,
    });

  const getRole = (id: string) =>
    useSWR(
      `/roles/${id}`,
      (url) => api.get<{ role: RoleWithPermissions }>(url).then((res) => res.data.role),
      {
        suspense: true,
      }
    );

  const createRole = () =>
    useSWRMutation(`/roles`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ id: number }>(url, arg).then((res) => res.data.id);
    });

  const updateRole = (id: string) =>
    useSWRMutation(`/roles/${id}`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getRoles,
      getRole,
      createRole,
      updateRole,
    }),
    [getRoles, getRole, createRole, updateRole]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useRole = () => useContext(Context);
