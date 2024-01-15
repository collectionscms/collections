import { Project } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { api } from '../../../utilities/api.js';
import { ProjectContext } from './types';

const Context = createContext({} as ProjectContext);

export const ProjectContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getProject = () =>
    useSWR(
      '/projects',
      (url) => api.get<{ project: Project }>(url).then((res) => res.data.project),
      { suspense: true }
    );

  const updateProject = () =>
    useSWRMutation('/projects', async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getProject,
      updateProject,
    }),
    [getProject, updateProject]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useProject = () => useContext(Context);
