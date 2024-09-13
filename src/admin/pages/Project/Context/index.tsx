import { Project } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { api } from '../../../utilities/api.js';

type ProjectContext = {
  getMyProject: () => SWRResponse<
    Project,
    Error,
    {
      suspense: true;
    }
  >;
  checkSubdomainAvailability: () => SWRMutationResponse<
    { available: boolean },
    any,
    string,
    Record<string, any>
  >;
  createProject: () => SWRMutationResponse<Project, any, string, Record<string, any>>;
  updateProject: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};

const Context = createContext({} as ProjectContext);

export const ProjectContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getMyProject = () =>
    useSWR(
      '/my/projects',
      (url) => api.get<{ project: Project }>(url).then((res) => res.data.project),
      { suspense: true }
    );

  const checkSubdomainAvailability = () =>
    useSWRMutation(
      '/projects/subdomain-availability',
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ available: boolean }>(url, arg).then((res) => res.data);
      }
    );

  const createProject = () =>
    useSWRMutation('/projects', async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post(url, arg).then((res) => res.data);
    });

  const updateProject = () =>
    useSWRMutation('/projects', async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getMyProject,
      checkSubdomainAvailability,
      createProject,
      updateProject,
    }),
    [getMyProject, checkSubdomainAvailability, createProject, updateProject]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useProject = () => useContext(Context);
