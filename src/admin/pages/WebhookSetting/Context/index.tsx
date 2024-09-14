import { WebhookSetting } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { api } from '../../../utilities/api.js';

type WebhookContext = {
  getWebhookSettings: () => SWRResponse<
    WebhookSetting[],
    Error,
    {
      suspense: true;
    }
  >;
};

const Context = createContext({} as WebhookContext);

export const WebhookContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getWebhookSettings = () =>
    useSWR(
      '/webhook-settings',
      (url) =>
        api.get<{ webhookSettings: WebhookSetting[] }>(url).then((res) => res.data.webhookSettings),
      {
        suspense: true,
      }
    );

  const value = useMemo(() => ({ getWebhookSettings }), [getWebhookSettings]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useWebhookSetting = () => useContext(Context);
