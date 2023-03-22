import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import { ProjectSetting } from '../../../../shared/types';
import api from '../../../utilities/api';
import { LoginContext } from './types';

const Context = createContext({} as LoginContext);

export const LoginContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getProjectSetting = (config?: SWRConfiguration) =>
    useSWR(
      '/project_settings',
      (url) =>
        api.get<{ projectSetting: ProjectSetting }>(url).then((res) => res.data.projectSetting),
      config
    );

  const value = useMemo(
    () => ({
      getProjectSetting,
    }),
    [getProjectSetting]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useLogin = () => useContext(Context);
