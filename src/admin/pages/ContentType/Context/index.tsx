import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';
import { Model, GetModel, GetField, PostModel } from '../../../config/types.js';
import { api } from '../../../utilities/api.js';
import { ModelContext } from './types.js';

const Context = createContext({} as ModelContext);

export const ModelContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getModel = (modelId: string) =>
    useSWR(
      `/models/${modelId}`,
      (url) => api.get<{ model: GetModel }>(url).then((res) => res.data.model),
      { suspense: true }
    );

  const getModels = (): SWRResponse =>
    useSWR('/models', (url) => api.get<{ models: Model[] }>(url).then((res) => res.data.models), {
      suspense: true,
    });

  const createModel = useSWRMutation(
    '/models',
    async (url: string, { arg }: { arg: Omit<PostModel, 'id'> }) => {
      return api.post<{ id: number }>(url, arg).then((res) => res.data.id);
    }
  );

  const updateModel = (id: string) =>
    useSWRMutation(`/models/${id}`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const getFields = (modelId: string) =>
    useSWR(
      `/models/${modelId}/fields`,
      (url) => api.get<{ fields: GetField[] }>(url).then((res) => res.data.fields),
      { suspense: true }
    );

  const updateFields = () =>
    useSWRMutation(`/fields`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getModel,
      getModels,
      createModel,
      updateModel,
      getFields,
      updateFields,
    }),
    [getModel, getModels, createModel, updateModel, getFields, updateFields]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useModel = () => useContext(Context);
