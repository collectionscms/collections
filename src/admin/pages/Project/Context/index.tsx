import { ProjectSetting } from '@shared/types';
import axios from 'axios';
import React, { createContext, useContext } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { ProjectSettingContext } from './type';

const Context = createContext({} as ProjectSettingContext);

export const ProjectSettingContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const getProjectSetting = (config?: SWRConfiguration) =>
    useSWR(
      '/api/project_settings',
      (url) =>
        axios
          .get<{ projectSetting: ProjectSetting }>(url)
          .then((res) => res.data.projectSetting)
          .catch((err) => Promise.reject(err.message)),
      config
    );

  const updateProjectSetting = (): SWRMutationResponse =>
    useSWRMutation('/api/project_settings', async (url: string, { arg }) => {
      return axios
        .patch(url, arg)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err.message));
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
