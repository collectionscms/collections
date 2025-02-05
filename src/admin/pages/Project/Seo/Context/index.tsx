import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { ExperienceWithResourceUrl } from '../../../../../types/index.js';
import { api } from '../../../../utilities/api.js';

type SeoContext = {
  getExperiences: () => SWRResponse<
    ExperienceWithResourceUrl[],
    Error,
    {
      suspense: true;
    }
  >;
  createExperience: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};

const Context = createContext({} as SeoContext);

export const SeoContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getExperiences = () =>
    useSWR(
      '/experiences',
      (url: string) =>
        api
          .get<{ experiences: ExperienceWithResourceUrl[] }>(url)
          .then((res) => res.data.experiences),
      {
        suspense: true,
      }
    );

  const createExperience = () =>
    useSWRMutation('/experiences', async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post(url, arg).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getExperiences,
      createExperience,
    }),
    [getExperiences, createExperience]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useSeo = () => useContext(Context);
