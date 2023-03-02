import React, { createContext, useContext } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { ProjectSetting } from '../../../../shared/types';
import api from '../../../utilities/api';
import { ProjectSettingContext } from './type';

const Context = createContext({} as ProjectSettingContext);

export const ProjectSettingContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const getProjectSetting = (config?: SWRConfiguration) =>
    useSWR(
      '/project_settings',
      (url) =>
        api.get<{ projectSetting: ProjectSetting }>(url).then((res) => res.data.projectSetting),
      config
    );

  const updateProjectSetting = (): SWRMutationResponse =>
    useSWRMutation('/project_settings', async (url: string, { arg }: { arg: string }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  return (
    <Context.Provider
      value={{
        getProjectSetting,
        updateProjectSetting,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useProjectSetting = () => useContext(Context);
