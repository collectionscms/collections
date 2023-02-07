import { Collection } from '@shared/types';
import axios from 'axios';
import React, { createContext, useContext } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';

type ContextType = {
  getCollection: (id: string, config?: SWRConfiguration) => SWRResponse<Collection>;
  getCollections: () => SWRResponse<Collection[]>;
  createCollection: SWRMutationResponse<Collection>;
  updateCollection: (id: string) => SWRMutationResponse<Collection>;
};

const Context = createContext<ContextType>({} as any);

export const CollectionContextProvider = ({ children }) => {
  const getCollection = (id: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/api/collections/${id}`,
      (url) =>
        axios
          .get<{ collection: Collection }>(url)
          .then((res) => res.data.collection)
          .catch((err) => Promise.reject(err.message)),
      config
    );

  const getCollections = (): SWRResponse =>
    useSWR('/api/collections', (url) =>
      axios
        .get<{ collections: Collection[] }>(url)
        .then((res) => res.data.collections)
        .catch((err) => Promise.reject(err.message))
    );

  const createCollection: SWRMutationResponse = useSWRMutation(
    '/api/collections',
    async (url: string, { arg }) => {
      return axios
        .post<{ collection: Collection }>(url, arg)
        .then((res) => res.data.collection)
        .catch((err) => Promise.reject(err.message));
    }
  );

  const updateCollection = (id: string): SWRMutationResponse =>
    useSWRMutation(`/api/collections/${id}`, async (url: string, { arg }) => {
      return axios
        .patch<{ collection: Collection }>(url, arg)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err.message));
    });

  return (
    <Context.Provider
      value={{
        getCollection,
        getCollections,
        createCollection,
        updateCollection,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCollection = () => useContext(Context);
