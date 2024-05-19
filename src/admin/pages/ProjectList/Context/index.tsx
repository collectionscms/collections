import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { ProjectRole } from '../../../../types/index.js';
import { api } from '../../../utilities/api.js';

export type ProjectListContext = {
  getMyProjects: () => SWRResponse<
    ProjectRole[],
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
  const getMyProjects = () =>
    useSWR(
      '/me/projects',
      (url) =>
        api
          .get<{
            projectRoles: ProjectRole[];
          }>(url)
          .then((res) => res.data.projectRoles),
      { suspense: true }
    );

  const value = useMemo(
    () => ({
      getMyProjects,
    }),
    [getMyProjects]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useProjectList = () => useContext(Context);
