import React, { createContext, useContext, useMemo } from 'react';
import { ContextType, Props } from './types';

const Context = createContext({} as ContextType);

export const DocumentInfoProvider: React.FC<Props> = (props) => {
  const { label, fields, children } = props;

  const value = useMemo(
    () => ({
      label,
      fields,
    }),
    [props]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useDocumentInfo = (): ContextType => useContext(Context);

export default Context;
