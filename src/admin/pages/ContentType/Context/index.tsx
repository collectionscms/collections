import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { Collection, Field } from '../../../../shared/types';
import api from '../../../utilities/api';
import { CollectionContext } from './type';

const Context = createContext({} as CollectionContext);

export const CollectionContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const getCollection = (id: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/collections/${id}`,
      (url) => api.get<{ collection: Collection }>(url).then((res) => res.data.collection),
      config
    );

  const getCollections = (): SWRResponse =>
    useSWR('/collections', (url) =>
      api.get<{ collections: Collection[] }>(url).then((res) => res.data.collections)
    );

  const createCollection: SWRMutationResponse = useSWRMutation(
    '/collections',
    async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ collection: Collection }>(url, arg).then((res) => res.data.collection);
    }
  );

  const updateCollection = (id: string): SWRMutationResponse =>
    useSWRMutation(
      `/collections/${id}`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch<{ collection: Collection }>(url, arg).then((res) => res.data);
      }
    );

  const getFields = (slug: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/collections/${slug}/fields`,
      (url) => api.get<{ fields: Field[] }>(url).then((res) => res.data.fields),
      config
    );

  const value = useMemo(
    () => ({
      getCollection,
      getCollections,
      createCollection,
      updateCollection,
      getFields,
    }),
    [getCollection, getCollections, createCollection, updateCollection, getFields]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useCollection = () => useContext(Context);
