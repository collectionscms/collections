import { Content } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { api } from '../../../utilities/api.js';

type TrashContext = {
  getTrashedContents: () => SWRResponse<
    Content[],
    Error,
    {
      suspense: true;
    }
  >;
  restore: (contentId: string) => SWRMutationResponse<void, any, string>;
};

const Context = createContext({} as TrashContext);

export const TrashContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getTrashedContents = () =>
    useSWR(
      '/trash/contents',
      (url) => api.get<{ contents: Content[] }>(url).then((res) => res.data.contents),
      {
        suspense: true,
      }
    );

  const restore = (contentId: string) =>
    useSWRMutation(`/contents/${contentId}/restore`, async (url: string) => {
      return api.patch(url).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getTrashedContents,
      restore,
    }),
    [getTrashedContents, restore]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useTrash = () => useContext(Context);
