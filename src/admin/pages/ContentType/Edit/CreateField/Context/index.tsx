import React, { createContext, useContext } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { Field } from '../../../../../../shared/types';
import api from '../../../../../utilities/api';
import { FieldContext } from './type';

const Context = createContext({} as FieldContext);

export const FieldContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createField = (slug: string): SWRMutationResponse =>
    useSWRMutation(`/collections/${slug}/fields`, async (url: string, { arg }: { arg: string }) => {
      return api.post<{ field: Field }>(url, arg).then((res) => res.data.field);
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
