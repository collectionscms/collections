import { ApiKey } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { ApiKeyWithPermissions } from '../../../../types/index.js';
import { api } from '../../../utilities/api.js';

type ApiKeyContext = {
  getApiKeys: () => SWRResponse<
    ApiKey[],
    Error,
    {
      suspense: true;
    }
  >;
  getApiKey: (id: string) => SWRResponse<
    ApiKeyWithPermissions,
    Error,
    {
      suspense: true;
    }
  >;
  createApiKey: () => SWRMutationResponse<ApiKey, any, string, Record<string, any>>;
  updateApiKey: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
};

const Context = createContext({} as ApiKeyContext);

export const ApiKeyContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getApiKeys = () =>
    useSWR(
      '/api-keys',
      (url) => api.get<{ apiKeys: ApiKey[] }>(url).then((res) => res.data.apiKeys),
      {
        suspense: true,
      }
    );

  const getApiKey = (id: string) =>
    useSWR(
      `/api-keys/${id}`,
      (url) => api.get<{ apiKey: ApiKeyWithPermissions }>(url).then((res) => res.data.apiKey),
      {
        suspense: true,
      }
    );

  const createApiKey = () =>
    useSWRMutation(`/api-keys`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ apiKey: ApiKey }>(url, arg).then((res) => res.data.apiKey);
    });

  const updateApiKey = (id: string) =>
    useSWRMutation(
      `/api-keys/${id}`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const value = useMemo(
    () => ({
      getApiKeys,
      getApiKey,
      createApiKey,
      updateApiKey,
    }),
    [getApiKeys, getApiKey, createApiKey, updateApiKey]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useApiKey = () => useContext(Context);
