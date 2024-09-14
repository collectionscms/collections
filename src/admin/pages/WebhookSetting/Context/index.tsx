import { WebhookSetting } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { api } from '../../../utilities/api.js';

type WebhookContext = {
  getWebhookSettings: () => SWRResponse<
    WebhookSetting[],
    Error,
    {
      suspense: true;
    }
  >;
  getWebhookSetting: (id: string) => SWRResponse<
    WebhookSetting,
    Error,
    {
      suspense: true;
    }
  >;
  createWebhookSetting: () => SWRMutationResponse<WebhookSetting, any, string, Record<string, any>>;
  updateWebhookSetting: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
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

  const getWebhookSetting = (id: string) =>
    useSWR(
      `/webhook-settings/${id}`,
      (url) =>
        api.get<{ webhookSetting: WebhookSetting }>(url).then((res) => res.data.webhookSetting),
      {
        suspense: true,
      }
    );

  const createWebhookSetting = () =>
    useSWRMutation(
      `/webhook-settings`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api
          .post<{ webhookSetting: WebhookSetting }>(url, arg)
          .then((res) => res.data.webhookSetting);
      }
    );

  const updateWebhookSetting = (id: string) =>
    useSWRMutation(
      `/webhook-settings/${id}`,
      async (url: string, { arg }: { arg: Record<string, any> }) => {
        return api.patch(url, arg).then((res) => res.data);
      }
    );

  const value = useMemo(
    () => ({ getWebhookSettings, getWebhookSetting, createWebhookSetting, updateWebhookSetting }),
    [getWebhookSettings, getWebhookSetting, createWebhookSetting, updateWebhookSetting]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useWebhookSetting = () => useContext(Context);
