import { Project } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { api } from '../../../utilities/api.js';

export type AcceptInvitationContext = {
  accept: () => SWRMutationResponse<Project, any, string, Record<string, any>>;
};

const Context = createContext({} as AcceptInvitationContext);

export const AcceptInvitationContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const accept = () =>
    useSWRMutation(
      '/invitations/accept',
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ project: Project }>(url, arg).then((res) => res.data.project);
      }
    );

  const value = useMemo(
    () => ({
      accept,
    }),
    [accept]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useInvitation = () => useContext(Context);
