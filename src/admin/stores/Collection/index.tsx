import { Collection } from '@shared/types';
import axios from 'axios';
import useSWR, { SWRResponse } from 'swr';
import React, { createContext, useContext, useState } from 'react';

type ContextType = {
  getCollections: () => SWRResponse<Collection[]>;
  collections: Collection[];
};

const Context = createContext<ContextType>({} as any);

export const CollectionContextProvider = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>([]);

  const getCollections = () =>
    useSWR('/api/collections', (url) =>
      axios.get<{ collections: Collection[] }>(url).then((res) => {
        setCollections(res.data.collections);
        return res.data.collections;
      })
    );

  return (
    <Context.Provider
      value={{
        getCollections,
        collections,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCollection = () => useContext(Context);
