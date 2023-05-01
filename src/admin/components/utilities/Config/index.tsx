import React, { createContext, useContext, useMemo } from 'react';
import useSWR from 'swr';
import { Collection } from '../../../../config/types.js';
import { api } from '../../../utilities/api.js';
import { useAuth } from '../Auth/index.js';

type ContextType = {
  collections: Collection[];
};

const Context = createContext<ContextType>({} as any);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const { data: collections } = useSWR(
    user ? '/collections' : null,
    (url) => api.get<{ collections: Collection[] }>(url).then((res) => res.data.collections),
    { suspense: true }
  );

  const value = useMemo(
    () => ({
      collections,
    }),
    [collections]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useConfig = () => useContext(Context);
