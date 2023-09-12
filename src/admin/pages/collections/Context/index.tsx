import React, { createContext, useContext, useMemo } from 'react';
import useSWR from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { File, GetCollection, GetField, GetRelation } from '../../../config/types.js';
import { api } from '../../../utilities/api.js';
import { ContentContext } from './types.js';

const Context = createContext({} as ContentContext);

export const ContentContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getContents = (collection: string) =>
    useSWR(
      `/collections/${collection}/contents`,
      (url) => api.get(url).then((res) => (res.data.data ? res.data.data : {})),
      { suspense: true }
    );

  const getContent = (collection: string, id: string) =>
    useSWR(
      `/collections/${collection}/contents/${id}`,
      (url) => api.get<{ data: any }>(url).then((res) => res.data.data),
      { suspense: true }
    );

  const getFields = (collection: string) =>
    useSWR(
      `/collections/${collection}/fields`,
      (url) => api.get<{ fields: GetField[] }>(url).then((res) => res.data.fields),
      { suspense: true }
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

  const getRelations = (collection: string, field: string) =>
    useSWR(
      `/relations/${collection}/${field}`,
      (url) => api.get<{ relations: GetRelation[] }>(url).then((res) => res.data.relations),
      { suspense: true }
    );

  const getCollection = (collection: string) =>
    useSWR(
      `/collections/${collection}`,
      (url) => api.get<{ collection: GetCollection }>(url).then((res) => res.data.collection),
      { suspense: true }
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
      getCollection,
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
      getCollection,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useContent = () => useContext(Context);
