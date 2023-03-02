import { Collection, Config } from '@shared/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
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
  const [collections, setCollections] = useState([]);
  const { data } = useSWR('/collections', (url) =>
    api.get<{ collections: Collection[] }>(url).then((res) => res.data.collections)
  );

  useEffect(() => {
    setCollections(data);
  }, [data]);

  return <Context.Provider value={{ collections, config }}>{children}</Context.Provider>;
};

export const useConfig = () => useContext(Context);
