import React, { createContext, useContext, useMemo } from 'react';
import useSWRMutation from 'swr/mutation';
import { api } from '../../../../utilities/api.js';
import { ImportFileContext } from './types.js';

const Context = createContext({} as ImportFileContext);

export const ImportFileContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const importWordPressXml = () =>
    useSWRMutation(
      `/collections/import`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.post<{ file: File; raw: string }>(url, arg).then((res) => res.data);
      }
    );

  const value = useMemo(
    () => ({
      importWordPressXml,
    }),
    [importWordPressXml]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useImportFile = () => useContext(Context);
