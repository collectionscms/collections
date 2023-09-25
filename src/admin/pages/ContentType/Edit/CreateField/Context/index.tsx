import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';
import { Model, Field } from '../../../../../config/types.js';
import { api } from '../../../../../utilities/api.js';
import { FieldContext } from './types.js';

const Context = createContext({} as FieldContext);

export const FieldContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createField = () =>
    useSWRMutation(`/fields`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ field: Field }>(url, arg).then((res) => res.data.field);
    });

  const createRelationalFields = () =>
    useSWRMutation(
      `/fields/relations`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ fields: Field[] }>(url, arg).then((res) => res.data.fields);
      }
    );

  const getModels = (): SWRResponse =>
    useSWR('/models', (url) => api.get<{ models: Model[] }>(url).then((res) => res.data.models), {
      suspense: true,
    });

  const value = useMemo(
    () => ({
      createField,
      createRelationalFields,
      getModels,
    }),
    [createField, getModels]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useField = () => useContext(Context);
