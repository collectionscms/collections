import { ApiKey } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { api } from '../../../utilities/api.js';

type ApiKeyContext = {
  getApiKeys: () => SWRResponse<
    ApiKey[],
    Error,
    {
      suspense: true;
    }
  >;
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

  const value = useMemo(
    () => ({
      getApiKeys,
    }),
    [getApiKeys]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useApiKey = () => useContext(Context);
