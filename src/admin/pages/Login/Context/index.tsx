import { ProjectSetting } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR from 'swr';
import { api } from '../../../utilities/api.js';
import { LoginContext } from './types.js';

const Context = createContext({} as LoginContext);

export const LoginContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getProjectSetting = () =>
    useSWR(
      '/project-settings',
      (url) =>
        api.get<{ projectSetting: ProjectSetting }>(url).then((res) => res.data.projectSetting),
      { suspense: true }
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
