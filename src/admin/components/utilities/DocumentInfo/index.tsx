import React, { createContext, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ContextType, Props } from './types.js';

const Context = createContext({} as ContextType);

export const DocumentInfoProvider: React.FC<Props> = (props) => {
  const { label, children } = props;
  const { t } = useTranslation();

  const value = useMemo(
    () => ({
      localizedLabel: t(label as unknown as TemplateStringsArray),
    }),
    [label]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useDocumentInfo = (): ContextType => useContext(Context);

export default Context;
