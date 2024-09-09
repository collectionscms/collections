import { Review } from '@prisma/client';
import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { api } from '../../../utilities/api.js';
import { ReviewWithParticipant } from '../../../../types/index.js';

type ReviewContext = {
  getReviews: () => SWRResponse<
    ReviewWithParticipant[],
    Error,
    {
      suspense: true;
    }
  >;
  getReview: (id: string) => SWRResponse<
    Review,
    Error,
    {
      suspense: true;
    }
  >;
  closeReview: (id: string) => SWRMutationResponse<void, any, string>;
  approveReview: (id: string) => SWRMutationResponse<void, any, string>;
};

const Context = createContext({} as ReviewContext);

export const ReviewContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getReviews = () =>
    useSWR(
      '/reviews',
      (url) => api.get<{ reviews: ReviewWithParticipant[] }>(url).then((res) => res.data.reviews),
      {
        suspense: true,
      }
    );

  const getReview = (id: string) =>
    useSWR(
      `/reviews/${id}`,
      (url) => api.get<{ review: Review }>(url).then((res) => res.data.review),
      {
        suspense: true,
      }
    );

  const closeReview = (id: string) =>
    useSWRMutation(`/reviews/${id}/close`, async (url: string) => {
      return api.patch(url).then((res) => res.data);
    });

  const approveReview = (id: string) =>
    useSWRMutation(`/reviews/${id}/approve`, async (url: string) => {
      return api.patch(url).then((res) => res.data);
    });

  const value = useMemo(
    () => ({
      getReviews,
      getReview,
      closeReview,
      approveReview,
    }),
    [getReviews, getReview, closeReview, approveReview]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useReview = () => useContext(Context);
