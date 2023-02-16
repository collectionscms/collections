import { Field } from '@shared/types';
import axios from 'axios';
import React, { createContext, useContext } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

type ContextType = {
  getContents: (slug: string, config?: SWRConfiguration) => SWRResponse<any[]>;
  getFields: (slug: string, config?: SWRConfiguration) => SWRResponse<Field[]>;
};

const Context = createContext<ContextType>({} as any);

export const ContentContextProvider = ({ children }) => {
  const getContents = (slug: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/api/collections/${slug}/contents`,
      (url) =>
        axios
          .get<{ contents: unknown[] }>(url)
          .then((res) => res.data.contents)
          .catch((err) => Promise.reject(err.message)),
      config
    );

  const getFields = (slug: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/api/collections/${slug}/fields`,
      (url) =>
        axios
          .get<{ fields: Field[] }>(url)
          .then((res) => res.data.fields)
          .catch((err) => Promise.reject(err.message)),
      config
    );

  return (
    <Context.Provider
      value={{
        getContents,
        getFields,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useContent = () => useContext(Context);
