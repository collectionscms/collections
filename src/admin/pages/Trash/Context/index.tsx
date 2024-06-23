import { Post } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { api } from '../../../utilities/api.js';

type TrashContext = {
  getTrashedPosts: () => SWRResponse<
    Post[],
    Error,
    {
      suspense: true;
    }
  >;
};

const Context = createContext({} as TrashContext);

export const TrashContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getTrashedPosts = () =>
    useSWR(
      '/posts?status=trashed',
      (url) => api.get<{ posts: Post[] }>(url).then((res) => res.data.posts),
      {
        suspense: true,
      }
    );

  const value = useMemo(
    () => ({
      getTrashedPosts,
    }),
    [getTrashedPosts]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useTrash = () => useContext(Context);
