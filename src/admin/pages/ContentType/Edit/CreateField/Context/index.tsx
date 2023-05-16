import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';
import { Collection, Field } from '../../../../../../config/types.js';
import { api } from '../../../../../utilities/api.js';
import { FieldContext } from './types.js';

const Context = createContext({} as FieldContext);

export const FieldContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createField = () =>
    useSWRMutation(`/fields`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ field: Field }>(url, arg).then((res) => res.data.field);
    });

  const getCollections = (): SWRResponse =>
    useSWR('/collections', (url) =>
      api.get<{ collections: Collection[] }>(url).then((res) => res.data.collections)
    );

  const value = useMemo(
    () => ({
      createField,
      getCollections,
    }),
    [createField, getCollections]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useField = () => useContext(Context);
