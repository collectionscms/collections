import { Collection, Config } from '@shared/types';
import React, { createContext, useContext } from 'react';
import useSWR from 'swr';
import api from '../../../utilities/api';

type ContextType = {
  collections: Collection[];
  config: Config;
};

const Context = createContext<ContextType>({} as any);

export const ConfigProvider: React.FC<{ config: Config; children: React.ReactNode }> = ({
  children,
  config,
}) => {
  const { data: collections } = useSWR(
    '/collections',
    (url) => api.get<{ collections: Collection[] }>(url).then((res) => res.data.collections),
    { suspense: true }
  );

  return <Context.Provider value={{ collections, config }}>{children}</Context.Provider>;
};

export const useConfig = () => useContext(Context);
