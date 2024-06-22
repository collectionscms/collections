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
  getPost: (
    id: string,
    locale: string | null
  ) => SWRResponse<
    LocalizedPost,
    Error,
    {
      suspense: true;
    }
  >;
  createPost: () => SWRMutationResponse<LocalizedPost, any, string>;
  createContent: (postId: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  changeStatus: (postId: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  updateContent: (contentId: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  trashContent: (contentId: string) => SWRMutationResponse<void, any, string>;
  requestReview: (contentId: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  publish: (contentId: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  createFileImage: () => SWRMutationResponse<
    { files: UploadFile[] },
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

  const getPost = (id: string, locale: string | null) =>
    useSWR(
      `/posts/${id}${locale ? `?locale=${locale}` : ''}`,
      (url) => api.get<{ post: LocalizedPost }>(url).then((res) => res.data.post),
      {
        suspense: true,
      }
    );

  const createPost = () =>
    useSWRMutation('/posts', async (url: string) => {
      return api.post<{ post: LocalizedPost }>(url).then((res) => res.data.post);
    });

  const createContent = (postId: string) =>
    useSWRMutation(
      `/posts/${postId}/contents`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post(url, arg).then((res) => res.data);
      }
    );

  const changeStatus = (postId: string) =>
    useSWRMutation(
      `/posts/${postId}/changeStatus`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const updateContent = (contentId: string) =>
    useSWRMutation(
      `/contents/${contentId}`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const trashContent = (contentId: string) =>
    useSWRMutation(`/contents/${contentId}/trash`, async (url: string) => {
      return api.delete(url).then((res) => res.data);
    });

  const requestReview = (contentId: string) =>
    useSWRMutation(
      `/contents/${contentId}/requestReview`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const publish = (contentId: string) =>
    useSWRMutation(
      `/contents/${contentId}/publish`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const createFileImage = () =>
    useSWRMutation(`/files`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ files: UploadFile[] }>(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getPosts,
      getPost,
      createPost,
      createContent,
      updateContent,
      trashContent,
      changeStatus,
      requestReview,
      publish,
      createFileImage,
    }),
    [
      getPosts,
      getPost,
      createPost,
      createContent,
      updateContent,
      trashContent,
      changeStatus,
      requestReview,
      publish,
      createFileImage,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const usePost = () => useContext(Context);
