import React, { createContext, useContext } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import api from '../../../../utilities/api';
import { DocumentContext } from './type';

const Context = createContext({} as DocumentContext);

export const DocumentContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deleteDocument = (id: string, slug: string): SWRMutationResponse =>
    useSWRMutation(`/${slug}/${id}`, async (url: string, { arg }) => {
      return api
        .delete(url, arg)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err.message));
    });

  return (
    <Context.Provider
      value={{
        deleteDocument,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useDocument = () => useContext(Context);
