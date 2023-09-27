import React, { createContext, useContext, useMemo } from 'react';
import useSWR from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { File, GetModel, GetField, GetRelation } from '../../../config/types.js';
import { api } from '../../../utilities/api.js';
import { ContentContext } from './types.js';

const Context = createContext({} as ContentContext);

export const ContentContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getContents = (modelId: string) =>
    useSWR(
      `/models/${modelId}/contents`,
      (url) => api.get(url).then((res) => (res.data.data ? res.data.data : {})),
      { suspense: true }
    );

  const getContent = (modelId: string, id: string) =>
    useSWR(
      `/models/${modelId}/contents/${id}`,
      (url) => api.get<{ data: any }>(url).then((res) => res.data.data),
      { suspense: true }
    );

  const getFields = (modelId: string) =>
    useSWR(
      `/models/${modelId}/fields`,
      (url) => api.get<{ fields: GetField[] }>(url).then((res) => res.data.fields),
      { suspense: true }
    );

  const createContent = (modelId: string) =>
    useSWRMutation(
      `/models/${modelId}/contents`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ id: number }>(url, arg).then((res) => res.data.id);
      }
    );

  const updateContent = (modelId: string, id: string) =>
    useSWRMutation(
      `/models/${modelId}/contents/${id}`,
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

  const getRelations = (modelId: string, field: string) =>
    useSWR(
      `/relations/${modelId}/${field}`,
      (url) => api.get<{ relations: GetRelation[] }>(url).then((res) => res.data.relations),
      { suspense: true }
    );

  const getModel = (modelId: string) =>
    useSWR(
      `/models/${modelId}`,
      (url) => api.get<{ model: GetModel }>(url).then((res) => res.data.model),
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
      getModel,
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
      getModel,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useContent = () => useContext(Context);
