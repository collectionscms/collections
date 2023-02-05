import { Collection } from '@shared/types';
import axios from 'axios';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import React, { createContext, useContext, useState } from 'react';

type ContextType = {
  getCollections: () => SWRResponse<Collection[]>;
  createCollection: SWRMutationResponse<Collection>;
  collections: Collection[];
};

const Context = createContext<ContextType>({} as any);

export const CollectionContextProvider = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>([]);

  const getCollections = () =>
    useSWR('/api/collections', (url) =>
      axios
        .get<{ collections: Collection[] }>(url)
        .then((res) => {
          setCollections(res.data.collections);
          return res.data.collections;
        })
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

  return (
    <Context.Provider
      value={{
        getCollections,
        createCollection,
        collections,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCollection = () => useContext(Context);
