import { ApiKey, Content } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { RevisedContent, SourceLanguagePostItem, UploadFile } from '../../../../types/index.js';
import { api } from '../../../utilities/api.js';

type PostContext = {
  getPosts: () => SWRResponse<
    SourceLanguagePostItem[],
    Error,
    {
      suspense: true;
    }
  >;
  createPost: () => SWRMutationResponse<RevisedContent, any, string>;
  trashPost: (postId: string) => SWRMutationResponse<void, any, string>;
  createContent: (postId: string) => SWRMutationResponse<Content, any, string, Record<string, any>>;
  translateContent: (
    postId: string
  ) => SWRMutationResponse<{ title: string; body: string }, any, string, Record<string, any>>;
  getContent: (id: string) => SWRResponse<
    RevisedContent,
    Error,
    {
      suspense: true;
    }
  >;
  updateContent: (contentId: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  revertContent: (contentId: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
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
    useSWR(
      '/posts',
      (url) => api.get<{ posts: SourceLanguagePostItem[] }>(url).then((res) => res.data.posts),
      {
        suspense: true,
      }
    );

  const createPost = () =>
    useSWRMutation('/posts', async (url: string) => {
      return api.post<{ content: RevisedContent }>(url).then((res) => res.data.content);
    });

  const trashPost = (postId: string) =>
    useSWRMutation(`/posts/${postId}/trash`, async (url: string) => {
      return api.delete(url).then((res) => res.data);
    });

  const createContent = (postId: string) =>
    useSWRMutation(
      `/posts/${postId}/contents`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ content: Content }>(url, arg).then((res) => res.data.content);
      }
    );

  const translateContent = (postId: string) =>
    useSWRMutation(
      `/posts/${postId}/translate`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post(url, arg).then((res) => res.data);
      }
    );

  const getContent = (id: string) =>
    useSWR(
      `/contents/${id}`,
      (url) => api.get<{ content: RevisedContent }>(url).then((res) => res.data.content),
      {
        suspense: true,
      }
    );

  const updateContent = (contentId: string) =>
    useSWRMutation(
      `/contents/${contentId}`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const revertContent = (contentId: string) =>
    useSWRMutation(
      `/contents/${contentId}/revert`,
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
      createPost,
      trashPost,
      createContent,
      updateContent,
      revertContent,
      trashContent,
      getContent,
      translateContent,
      requestReview,
      publish,
      archive,
      createFileImage,
      getApiKeys,
    }),
    [
      getPosts,
      createPost,
      trashPost,
      createContent,
      updateContent,
      revertContent,
      trashContent,
      getContent,
      translateContent,
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
