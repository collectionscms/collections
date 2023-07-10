import React, { createContext, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentContext, Props } from './types.js';

const Context = createContext({} as DocumentContext);

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

export const useDocumentInfo = (): DocumentContext => useContext(Context);

export default Context;
