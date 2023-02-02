import { Collection } from '@shared/types';
import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

type ContextType = {
  getCollections: () => Promise<Collection[]>;
  collections: Collection[];
};

const Context = createContext<ContextType>({} as any);

export const CollectionContextProvider = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>([]);

  const getCollections = async () => {
    try {
      const response = await axios.get<{ collections: Collection[] }>('/api/collections');
      setCollections(response.data.collections);
      return response.data.collections;
    } catch (e) {
      throw e.response.data;
    }
  };

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
