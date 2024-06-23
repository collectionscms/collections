import { Post } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { api } from '../../../utilities/api.js';

type TrashContext = {
  getTrashedPosts: () => SWRResponse<
    Post[],
    Error,
    {
      suspense: true;
    }
  >;
  restore: (postId: string) => SWRMutationResponse<void, any, string>;
};

const Context = createContext({} as TrashContext);

export const TrashContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getTrashedPosts = () =>
    useSWR(
      '/trashedPosts',
      (url) => api.get<{ posts: Post[] }>(url).then((res) => res.data.posts),
      {
        suspense: true,
      }
    );

  const restore = (postId: string) =>
    useSWRMutation(`/trashedPosts/${postId}/restore`, async (url: string) => {
      return api.patch(url).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getTrashedPosts,
      restore,
    }),
    [getTrashedPosts, restore]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useTrash = () => useContext(Context);
