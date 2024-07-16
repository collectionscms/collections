import { ApiKey } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
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
    ApiKey,
    Error,
    {
      suspense: true;
    }
  >;
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
      (url) => api.get<{ apiKey: ApiKey }>(url).then((res) => res.data.apiKey),
      {
        suspense: true,
      }
    );

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
      updateApiKey,
    }),
    [getApiKeys, getApiKey, updateApiKey]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useApiKey = () => useContext(Context);
