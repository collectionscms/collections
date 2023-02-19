import axios from 'axios';
import React, { createContext, useContext } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';

type ContextType = {
  deleteDocument: (id: string, slug: string) => SWRMutationResponse;
};

const Context = createContext<ContextType>({} as any);

export const DocumentContextProvider = ({ children }) => {
  const deleteDocument = (id: string, slug: string): SWRMutationResponse =>
    useSWRMutation(`/api/${slug}/${id}`, async (url: string, { arg }) => {
      return axios
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
