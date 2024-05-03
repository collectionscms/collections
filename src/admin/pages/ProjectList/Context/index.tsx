import { Project } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { api } from '../../../utilities/api.js';

export type ProjectListContext = {
  getProjects: () => SWRResponse<
    Project[],
    Error,
    {
      suspense: true;
    }
  >;
};

const Context = createContext({} as ProjectListContext);

export const ProjectListContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const getProjects = () =>
    useSWR(
      '/projects',
      (url) => api.get<{ projects: Project[] }>(url).then((res) => res.data.projects),
      { suspense: true }
    );

  const value = useMemo(
    () => ({
      getProjects,
    }),
    [getProjects]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useProjectList = () => useContext(Context);
