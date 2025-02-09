import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { AuthorProfile, ProjectWithExperiences, UploadFile } from '../../../../types/index.js';
import { api } from '../../../utilities/api.js';

type ProfileContext = {
  getProfile: () => SWRResponse<
    AuthorProfile,
    Error,
    {
      suspense: true;
    }
  >;
  getMyProjectExperiences: () => SWRResponse<
    ProjectWithExperiences[],
    Error,
    {
      suspense: true;
    }
  >;
  updateMe: () => SWRMutationResponse<void, any, string, Record<string, any>>;
  createFileImage: () => SWRMutationResponse<
    { files: UploadFile[] },
    any,
    string,
    Record<string, any>
  >;
};

const Context = createContext({} as ProfileContext);

export const ProfileContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getProfile = () =>
    useSWR('/me/profile', (url) => api.get<AuthorProfile>(url).then((res) => res.data), {
      suspense: true,
    });

  const getMyProjectExperiences = () =>
    useSWR(
      '/me/project-experiences',
      (url) =>
        api
          .get<{ projectExperiences: ProjectWithExperiences[] }>(url)
          .then((res) => res.data.projectExperiences),
      {
        suspense: true,
      }
    );

  const updateMe = () =>
    useSWRMutation('/me', async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const createFileImage = () =>
    useSWRMutation(`/files`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ files: UploadFile[] }>(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getProfile,
      getMyProjectExperiences,
      updateMe,
      createFileImage,
    }),
    [getProfile, getMyProjectExperiences, updateMe, createFileImage]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useProfile = () => useContext(Context);
