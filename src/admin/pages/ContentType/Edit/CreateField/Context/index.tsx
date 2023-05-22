import React, { createContext, useContext, useMemo } from 'react';
import useSWRMutation from 'swr/mutation';
import { Collection, Field, Relation } from '../../../../../../config/types.js';
import { api } from '../../../../../utilities/api.js';
import { FieldContext } from './types.js';
import useSWR, { SWRResponse } from 'swr';

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

  const createRelations = () =>
    useSWRMutation(`/relations`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ relation: Relation }>(url, arg).then((res) => res.data.relation);
    });

  const value = useMemo(
    () => ({
      createField,
      getCollections,
      createRelations,
    }),
    [createField, getCollections, createRelations]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useField = () => useContext(Context);
