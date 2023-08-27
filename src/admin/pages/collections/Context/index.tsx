import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { File, GetCollections, GetField, GetRelation } from '../../../../config/types.js';
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

  const getContent = (collection: string, id: string | null): SWRMutationResponse =>
    useSWRMutation(id ? `/collections/${collection}/contents/${id}` : null, (url) =>
      api.get<{ data: any }>(url).then((res) => res.data.data)
    );

  const getFields = (
    collection: string,
    canFetch: boolean = true,
    config?: SWRConfiguration
  ): SWRResponse =>
    useSWR(
      canFetch ? `/collections/${collection}/fields` : null,
      (url) => api.get<{ fields: GetField[] }>(url).then((res) => res.data.fields),
      config
    );

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
      api.get<{ relations: GetRelation[] }>(url).then((res) => res.data.relations)
    );

  const getCollections = (collection: string | null): SWRResponse =>
    useSWR(collection ? `/collections?collection=${collection}` : null, (url) =>
      api.get<{ collections: GetCollections }>(url).then((res) => res.data)
    );

  const value = useMemo(
    () => ({
      getContents,
      getContent,
      getFields,
      createContent,
      updateContent,
      getFileImage,
      createFileImage,
      getRelations,
      getCollections,
    }),
    [
      getContents,
      getContent,
      getFields,
      createContent,
      updateContent,
      getFileImage,
      createFileImage,
      getRelations,
      getCollections,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useContent = () => useContext(Context);
