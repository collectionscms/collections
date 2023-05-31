import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { Field, File, Relation } from '../../../../config/types.js';
import { api } from '../../../utilities/api.js';
import { ContentContext } from './types.js';

const Context = createContext({} as ContentContext);

export const ContentContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getContents = (
    collection: string,
    canFetch: boolean = true,
    config?: SWRConfiguration
  ): SWRResponse =>
    useSWR(
      canFetch ? `/collections/${collection}/contents` : null,
      (url) => api.get(url).then((res) => res.data.data),
      config
    );

  const getSingletonContent = (
    collection: string,
    canFetch: boolean = true,
    config?: SWRConfiguration
  ): SWRResponse =>
    useSWR(
      canFetch ? `/collections/${collection}/contents` : null,
      (url) => api.get<{ content: unknown }>(url).then((res) => res.data.content),
      config
    );

  const getContent = (collection: string, id: string | null): SWRMutationResponse =>
    useSWRMutation(id ? `/collections/${collection}/contents/${id}` : null, (url) =>
      api.get<{ content: unknown }>(url).then((res) => res.data.content)
    );

  const getFields = (
    collection: string,
    canFetch: boolean = true,
    config?: SWRConfiguration
  ): SWRResponse =>
    useSWR(
      canFetch ? `/collections/${collection}/fields` : null,
      (url) => api.get<{ fields: Field[] }>(url).then((res) => res.data.fields),
      config
    );

  const getPreviewContents = (collection: string): SWRMutationResponse =>
    useSWRMutation(`/collections/${collection}/contents`, async (url: string, { arg }) => {
      return api.get<{ contents: unknown[] }>(url, arg).then((res) => res.data.contents);
    });

  const createContent = (collection: string) =>
    useSWRMutation(
      `/collections/${collection}/contents`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ id: number }>(url, arg).then((res) => res.data.id);
      }
    );

  const updateContent = (collection: string, id: string) =>
    useSWRMutation(
      `/collections/${collection}/contents/${id}`,
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

  const getRelations = (collection: string, field: string): SWRResponse =>
    useSWR(`/relations/${collection}/${field}`, (url) =>
      api.get<{ relations: Relation[] }>(url).then((res) => res.data.relations)
    );

  const value = useMemo(
    () => ({
      getContents,
      getContent,
      getFields,
      getPreviewContents,
      createContent,
      updateContent,
      getFileImage,
      createFileImage,
      getRelations,
    }),
    [
      getContents,
      getContent,
      getFields,
      getPreviewContents,
      createContent,
      updateContent,
      getFileImage,
      createFileImage,
      getRelations,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useContent = () => useContext(Context);
