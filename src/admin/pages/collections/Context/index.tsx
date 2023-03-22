import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { Field } from '../../../../shared/types';
import api from '../../../utilities/api';
import { ContentContext } from './types';

const Context = createContext({} as ContentContext);

export const ContentContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getContents = (canFetch: boolean, slug: string, config?: SWRConfiguration): SWRResponse =>
    // Fetching data that depends on fields.
    useSWR(
      canFetch ? `/collections/${slug}/contents` : null,
      (url) => api.get<{ contents: unknown[] }>(url).then((res) => res.data.contents),
      config
    );

  const getContent = (slug: string, id: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/collections/${slug}/contents/${id}`,
      (url) => api.get<{ content: unknown }>(url).then((res) => res.data.content),
      config
    );

  const getFields = (slug: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/collections/${slug}/fields`,
      (url) => api.get<{ fields: Field[] }>(url).then((res) => res.data.fields),
      config
    );

  const getPreviewContents = (slug: string): SWRMutationResponse =>
    useSWRMutation(`/collections/${slug}/contents`, async (url: string, { arg }) => {
      return api.get<{ contents: unknown[] }>(url, arg).then((res) => res.data.contents);
    });

  const createContent = (slug: string): SWRMutationResponse =>
    useSWRMutation(`/collections/${slug}/contents`, async (url: string, { arg }) => {
      return api.post<{ content: unknown }>(url, arg).then((res) => res.data.content);
    });

  const updateContent = (slug: string, id: string): SWRMutationResponse =>
    useSWRMutation(`/collections/${slug}/contents/${id}`, async (url: string, { arg }) => {
      return api.patch<{ content: unknown }>(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getContents,
      getContent,
      getFields,
      getPreviewContents,
      createContent,
      updateContent,
    }),
    [getContents, getContent, getFields, getPreviewContents, createContent, updateContent]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useContent = () => useContext(Context);
