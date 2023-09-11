import React, { createContext, useContext, useMemo } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { api } from '../../../../utilities/api.js';
import { DocumentContext } from './types.js';

const Context = createContext({} as DocumentContext);

export const DocumentContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deleteDocument = (id: string, slug: string): SWRMutationResponse =>
    useSWRMutation(
      `/${slug}/${id}`,
      async (url: string, { arg }) => {
        return api.delete(url, arg).then((res) => res.data);
      },
      {
        revalidate: false,
      }
    );

  const value = useMemo(
    () => ({
      deleteDocument,
    }),
    [deleteDocument]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useDocument = () => useContext(Context);
