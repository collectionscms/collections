import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { Collection, GetCollection, GetField, PostCollection } from '../../../config/types.js';
import { api } from '../../../utilities/api.js';
import { CollectionContext } from './types.js';

const Context = createContext({} as CollectionContext);

export const CollectionContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const getCollection = (id: string): SWRMutationResponse =>
    useSWRMutation(`/collections/${id}`, (url) =>
      api.get<{ collection: GetCollection }>(url).then((res) => res.data.collection)
    );

  const getCollections = (): SWRResponse =>
    useSWR('/collections', (url) =>
      api.get<{ collections: Collection[] }>(url).then((res) => res.data.collections)
    );

  const createCollection = useSWRMutation(
    '/collections',
    async (url: string, { arg }: { arg: Omit<PostCollection, 'id'> }) => {
      return api.post<{ id: number }>(url, arg).then((res) => res.data.id);
    }
  );

  const updateCollection = (id: string) =>
    useSWRMutation(
      `/collections/${id}`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const getFields = (collection: string | null, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      () => (collection ? `/collections/${collection}/fields` : null),
      (url) => api.get<{ fields: GetField[] }>(url).then((res) => res.data.fields),
      config
    );

  const updateFields = () =>
    useSWRMutation(`/fields`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.patch(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getCollection,
      getCollections,
      createCollection,
      updateCollection,
      getFields,
      updateFields,
    }),
    [getCollection, getCollections, createCollection, updateCollection, getFields, updateFields]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useCollection = () => useContext(Context);
