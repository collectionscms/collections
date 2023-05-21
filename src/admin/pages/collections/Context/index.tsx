import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { Field, File } from '../../../../config/types.js';
import { api } from '../../../utilities/api.js';
import { ContentContext } from './types.js';

const Context = createContext({} as ContentContext);

export const ContentContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getContents = (canFetch: boolean, slug: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      canFetch ? `/collections/${slug}/contents` : null,
      (url) => api.get<{ contents: unknown[] }>(url).then((res) => res.data.contents),
      config
    );

  const getSingletonContent = (
    canFetch: boolean,
    slug: string,
    config?: SWRConfiguration
  ): SWRResponse =>
    useSWR(
      canFetch ? `/collections/${slug}/contents` : null,
      (url) => api.get<{ content: unknown }>(url).then((res) => res.data.content),
      config
    );

  const getContent = (slug: string, id: string | null): SWRMutationResponse =>
    useSWRMutation(id ? `/collections/${slug}/contents/${id}` : null, (url) =>
      api.get<{ content: unknown }>(url).then((res) => res.data.content)
    );

  const getFields = (slug: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/collections/${slug}/fields`,
      (url) => api.get<{ fields: Field[] }>(url).then((res) => res.data.fields),
      config
    );

  const getPreviewContents = (slug: string): SWRMutationResponse =>
    useSWRMutation(`/collections/${slug}/contents`, async (url: string, { arg }) => {
      return api.get<{ contents: unknown[] }>(url, arg).then((res) => res.data.contents);
    });

  const createContent = (slug: string) =>
    useSWRMutation(
      `/collections/${slug}/contents`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ id: number }>(url, arg).then((res) => res.data.id);
      }
    );

  const updateContent = (slug: string, id: string) =>
    useSWRMutation(
      `/collections/${slug}/contents/${id}`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const getFileImage = (id: string | null): SWRMutationResponse<{ file: File; raw: string }> =>
    useSWRMutation(id ? `/files/${id}` : null, (url) =>
      api.get<{ file: File; raw: string }>(url).then((res) => res.data)
    );

  const createFileImage = () =>
    useSWRMutation(`/files`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ file: File; raw: string }>(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getContents,
      getSingletonContent,
      getContent,
      getFields,
      getPreviewContents,
      createContent,
      updateContent,
      getFileImage,
      createFileImage,
    }),
    [
      getContents,
      getSingletonContent,
      getContent,
      getFields,
      getPreviewContents,
      createContent,
      updateContent,
      getFileImage,
      createFileImage,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useContent = () => useContext(Context);
