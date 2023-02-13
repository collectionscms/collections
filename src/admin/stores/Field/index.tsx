import { Field } from '@shared/types';
import axios from 'axios';
import React, { createContext, useContext } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';

type ContextType = {
  createField: (id: string) => SWRMutationResponse<Field>;
};

const Context = createContext<ContextType>({} as any);

export const FieldContextProvider = ({ children }) => {
  const createField = (id: string): SWRMutationResponse =>
    useSWRMutation(`/api/collections/${id}/fields`, async (url: string, { arg }) => {
      return axios
        .post<{ field: Field }>(url, arg)
        .then((res) => res.data.field)
        .catch((err) => Promise.reject(err.message));
    });

  return (
    <Context.Provider
      value={{
        createField,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useField = () => useContext(Context);
