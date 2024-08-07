import { ApiKey } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { LocalizedPost, PostItem, UploadFile } from '../../../../types/index.js';
import { api } from '../../../utilities/api.js';

type PostContext = {
  getPosts: () => SWRResponse<
    PostItem[],
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
  trashPost: (postId: string) => SWRMutationResponse<void, any, string>;
  updatePost: (postId: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  createContent: (postId: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  createBulkContent: (
    postId: string
  ) => SWRMutationResponse<void, any, string, Record<string, any>>;
  updateContent: (contentId: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  trashContent: (contentId: string) => SWRMutationResponse<void, any, string>;
  requestReview: (contentId: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  publish: (contentId: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  archive: (contentId: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  createFileImage: () => SWRMutationResponse<
    { files: UploadFile[] },
    any,
    string,
    Record<string, any>
  >;
  getApiKeys: () => SWRMutationResponse<ApiKey[], Error>;
};

const Context = createContext({} as PostContext);

export const PostContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getPosts = () =>
    useSWR('/posts', (url) => api.get<{ posts: PostItem[] }>(url).then((res) => res.data.posts), {
      suspense: true,
    });

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

  const trashPost = (postId: string) =>
    useSWRMutation(`/posts/${postId}/trash`, async (url: string) => {
      return api.delete(url).then((res) => res.data);
    });

  const updatePost = (postId: string) =>
    useSWRMutation(
      `/posts/${postId}`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const createContent = (postId: string) =>
    useSWRMutation(
      `/posts/${postId}/contents`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post(url, arg).then((res) => res.data);
      }
    );

  const createBulkContent = (postId: string) =>
    useSWRMutation(
      `/posts/${postId}/contents/bulk`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post(url, arg).then((res) => res.data);
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
      `/contents/${contentId}/request-review`,
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

  const archive = (contentId: string) =>
    useSWRMutation(
      `/contents/${contentId}/archive`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const createFileImage = () =>
    useSWRMutation(`/files`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ files: UploadFile[] }>(url, arg).then((res) => res.data);
    });

  const getApiKeys = () =>
    useSWRMutation(`/api-keys`, async (url: string) => {
      return api.get<{ apiKeys: ApiKey[] }>(url).then((res) => res.data.apiKeys);
    });

  const value = useMemo(
    () => ({
      getPosts,
      getPost,
      createPost,
      trashPost,
      updatePost,
      createContent,
      updateContent,
      trashContent,
      createBulkContent,
      requestReview,
      publish,
      archive,
      createFileImage,
      getApiKeys,
    }),
    [
      getPosts,
      getPost,
      createPost,
      trashPost,
      updatePost,
      createContent,
      updateContent,
      trashContent,
      createBulkContent,
      requestReview,
      publish,
      archive,
      createFileImage,
      getApiKeys,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const usePost = () => useContext(Context);
