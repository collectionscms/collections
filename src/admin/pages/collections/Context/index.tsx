import { Field } from '@shared/types';
import React, { createContext, useContext } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import api from '../../../utilities/api';
import { ContentContext } from './type';

const Context = createContext({} as ContentContext);

export const ContentContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getContents = (slug: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/collections/${slug}/contents`,
      (url) =>
        api
          .get<{ contents: unknown[] }>(url)
          .then((res) => res.data.contents)
          .catch((err) => Promise.reject(err.message)),
      config
    );

  const getContent = (slug: string, id: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/collections/${slug}/contents/${id}`,
      (url) =>
        api
          .get<{ content: unknown }>(url)
          .then((res) => res.data.content)
          .catch((err) => Promise.reject(err.message)),
      config
    );

  const getFields = (slug: string, config?: SWRConfiguration): SWRResponse =>
    useSWR(
      `/collections/${slug}/fields`,
      (url) =>
        api
          .get<{ fields: Field[] }>(url)
          .then((res) => res.data.fields)
          .catch((err) => Promise.reject(err.message)),
      config
    );

  const getPreviewContents = (slug: string): SWRMutationResponse =>
    useSWRMutation(`/collections/${slug}/contents`, async (url: string, { arg }) => {
      return api
        .get<{ contents: unknown[] }>(url, arg)
        .then((res) => res.data.contents)
        .catch((err) => Promise.reject(err.message));
    });

  const createContent = (slug: string): SWRMutationResponse =>
    useSWRMutation(`/collections/${slug}/contents`, async (url: string, { arg }) => {
      return api
        .post<{ content: unknown }>(url, arg)
        .then((res) => res.data.content)
        .catch((err) => Promise.reject(err.message));
    });

  const updateContent = (slug: string, id: string): SWRMutationResponse =>
    useSWRMutation(`/collections/${slug}/contents/${id}`, async (url: string, { arg }) => {
      return api
        .patch<{ content: unknown }>(url, arg)
        .then((res) => res.data)
        .catch((err) => Promise.reject(err.message));
    });

  return (
    <Context.Provider
      value={{
        getContents,
        getContent,
        getFields,
        getPreviewContents,
        createContent,
        updateContent,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useContent = () => useContext(Context);
