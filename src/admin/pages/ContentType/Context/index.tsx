import React, { createContext, useContext } from 'react';
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
      (url) =>
        api
          .get<{ collection: Collection }>(url)
          .then((res) => res.data.collection)
          .catch((err) => Promise.reject(err.message)),
      config
    );

  const getCollections = (): SWRResponse =>
    useSWR('/collections', (url) =>
      api
        .get<{ collections: Collection[] }>(url)
        .then((res) => res.data.collections)
        .catch((err) => Promise.reject(err.message))
    );

  const createCollection: SWRMutationResponse = useSWRMutation(
    '/collections',
    async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api
        .post<{ collection: Collection }>(url, arg)
        .then((res) => res.data.collection)
        .catch((err) => Promise.reject(err.message));
    }
  );

  const updateCollection = (id: string): SWRMutationResponse =>
    useSWRMutation(
      `/collections/${id}`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api
          .patch<{ collection: Collection }>(url, arg)
          .then((res) => res.data)
          .catch((err) => Promise.reject(err.message));
      }
    );

  const getFields = (slug: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/collections/${slug}/fields`,
      (url) =>
        api
          .get<{ fields: Field[] }>(url)
          .then((res) => res.data.fields)
          .catch((err) => Promise.reject(err.message)),
      config
    );

  return (
    <Context.Provider
      value={{
        getCollection,
        getCollections,
        createCollection,
        updateCollection,
        getFields,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCollection = () => useContext(Context);
