import { ProjectSetting } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { api } from '../../../utilities/api.js';
import { ProjectSettingContext } from './types';

const Context = createContext({} as ProjectSettingContext);

export const ProjectSettingContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const getProjectSetting = () =>
    useSWR(
      '/project-settings',
      (url) =>
        api.get<{ projectSetting: ProjectSetting }>(url).then((res) => res.data.projectSetting),
      { suspense: true }
    );

  const updateProjectSetting = () =>
    useSWRMutation(
      '/project-settings',
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const value = useMemo(
    () => ({
      getProjectSetting,
      updateProjectSetting,
    }),
    [getProjectSetting, updateProjectSetting]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useProjectSetting = () => useContext(Context);
