import { Review } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import { api } from '../../../utilities/api.js';

type ReviewContext = {
  getReviews: () => SWRResponse<
    Review[],
    Error,
    {
      suspense: true;
    }
  >;
};

const Context = createContext({} as ReviewContext);

export const ReviewContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getReviews = () =>
    useSWR(
      '/reviews',
      (url) => api.get<{ reviews: Review[] }>(url).then((res) => res.data.reviews),
      {
        suspense: true,
      }
    );

  const value = useMemo(
    () => ({
      getReviews,
    }),
    [getReviews]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useReview = () => useContext(Context);
