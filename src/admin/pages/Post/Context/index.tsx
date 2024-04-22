import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { LocalizedPost, UploadFile } from '../../../../types/index.js';
import { api } from '../../../utilities/api.js';

type PostContext = {
  getPosts: () => SWRResponse<
    LocalizedPost[],
    Error,
    {
      suspense: true;
    }
  >;
  getPost: (id: string) => SWRResponse<
    LocalizedPost,
    Error,
    {
      suspense: true;
    }
  >;
  createPost: () => SWRMutationResponse<LocalizedPost, any, string>;
  updatePost: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  createContent: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  updateContent: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  changeStatus: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  createFileImage: () => SWRMutationResponse<
    { file: UploadFile },
    any,
    string,
    Record<string, any>
  >;
};

const Context = createContext({} as PostContext);

export const PostContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getPosts = () =>
    useSWR(
      '/posts',
      (url) => api.get<{ posts: LocalizedPost[] }>(url).then((res) => res.data.posts),
      {
        suspense: true,
      }
    );

  const getPost = (id: string) =>
    useSWR(
      `/posts/${id}`,
      (url) => api.get<{ post: LocalizedPost }>(url).then((res) => res.data.post),
      {
        suspense: true,
      }
    );

  const createPost = () =>
    useSWRMutation('/posts', async (url: string) => {
      return api.post<{ post: LocalizedPost }>(url).then((res) => res.data.post);
    });

  const updatePost = (id: string) =>
    useSWRMutation(`/posts/${id}`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const createContent = (id: string) =>
    useSWRMutation(
      `/posts/${id}/contents`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post(url, arg).then((res) => res.data);
      }
    );

  const changeStatus = (id: string) =>
    useSWRMutation(
      `/posts/${id}/changeStatus`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const updateContent = (id: string) =>
    useSWRMutation(
      `/contents/${id}`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const createFileImage = () =>
    useSWRMutation(`/files`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ file: UploadFile }>(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getPosts,
      getPost,
      createPost,
      updatePost,
      createContent,
      updateContent,
      changeStatus,
      createFileImage,
    }),
    [
      getPosts,
      getPost,
      createPost,
      updatePost,
      createContent,
      updateContent,
      changeStatus,
      createFileImage,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const usePost = () => useContext(Context);
