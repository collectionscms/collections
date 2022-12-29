import { Config } from '@shared/types';
import React, { createContext, useContext } from 'react';

const Context = createContext<Config>({} as Config);

export const ConfigProvider: React.FC<{ config: Config; children: React.ReactNode }> = ({
  children,
  config,
}) => <Context.Provider value={config}>{children}</Context.Provider>;

export const useConfig = (): Config => useContext(Context);
