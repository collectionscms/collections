import { ProjectSetting } from '@shared/types';
import axios from 'axios';
import React, { createContext, useContext } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';

type ContextType = {
  getProjectSetting: (config?: SWRConfiguration) => SWRResponse<ProjectSetting>;
  updateProjectSetting: () => SWRMutationResponse;
};

const Context = createContext<ContextType>({} as any);

export const ProjectSettingContextProvider = ({ children }) => {
  const getProjectSetting = (config?: SWRConfiguration) =>
    useSWR(
      '/api/project_settings',
      (url) =>
        axios
          .get<{ project_setting: ProjectSetting }>(url)
          .then((res) => res.data.project_setting)
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
