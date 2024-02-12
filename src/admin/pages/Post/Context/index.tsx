import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { LocalizedPost } from '../../../../types/index.js';
import { api } from '../../../utilities/api.js';

type PostContext = {
  getPosts: () => SWRResponse<
    LocalizedPost[],
    Error,
    {
      suspense: true;
    }
  >;
};

const Context = createContext({} as PostContext);

export const PostContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getPosts = () =>
    useSWR(
      '/posts',
      (url) => api.get<{ posts: LocalizedPost[] }>(url).then((res) => res.data.posts),
      {
        suspense: true,
      }
    );

  const value = useMemo(
    () => ({
      getPosts,
    }),
    [getPosts]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const usePost = () => useContext(Context);
