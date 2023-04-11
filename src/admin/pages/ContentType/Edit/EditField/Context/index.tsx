import React, { createContext, useContext, useMemo } from 'react';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { Field } from '../../../../../../shared/types';
import api from '../../../../../utilities/api';
import { FieldContext } from './types';

const Context = createContext({} as FieldContext);

export const FieldContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const updateField = (id: number): SWRMutationResponse =>
    useSWRMutation(`/fields/${id}`, async (url: string, { arg }: { arg: string }) => {
      return api.patch<{ field: Field }>(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      updateField,
    }),
    [updateField]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useField = () => useContext(Context);
