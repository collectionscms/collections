import { Field } from '@shared/types';
import axios from 'axios';
import React, { createContext, useContext } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { FieldContext } from './type';

const Context = createContext({} as FieldContext);

export const FieldContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createField = (slug: string): SWRMutationResponse =>
    useSWRMutation(`/api/collections/${slug}/fields`, async (url: string, { arg }) => {
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
