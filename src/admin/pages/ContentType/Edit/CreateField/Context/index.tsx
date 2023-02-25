import { Field } from '@shared/types';
import React, { createContext, useContext } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import api from '../../../../../utilities/api';
import { FieldContext } from './type';

const Context = createContext({} as FieldContext);

export const FieldContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createField = (slug: string): SWRMutationResponse =>
    useSWRMutation(`/collections/${slug}/fields`, async (url: string, { arg }) => {
      return api
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
