import React, { createContext, useContext, useMemo } from 'react';
import useSWR, { SWRResponse } from 'swr';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { ReviewWithContentAndParticipant } from '../../../../types/index.js';
import { api } from '../../../utilities/api.js';

type ReviewContext = {
  getPendingReviews: () => SWRResponse<
    ReviewWithContentAndParticipant[],
    Error,
    {
      suspense: true;
    }
  >;
  getApprovedReviews: () => SWRResponse<
    ReviewWithContentAndParticipant[],
    Error,
    {
      suspense: true;
    }
  >;
  getClosedReviews: () => SWRResponse<
    ReviewWithContentAndParticipant[],
    Error,
    {
      suspense: true;
    }
  >;
  getReview: (id: string) => SWRResponse<
    ReviewWithContentAndParticipant,
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
  const getPendingReviews = () =>
    useSWR(
      '/reviews?status=pending',
      (url) =>
        api
          .get<{ reviews: ReviewWithContentAndParticipant[] }>(url)
          .then((res) => res.data.reviews),
      {
        suspense: true,
      }
    );

  const getApprovedReviews = () =>
    useSWR(
      '/reviews?status=approved',
      (url) =>
        api
          .get<{ reviews: ReviewWithContentAndParticipant[] }>(url)
          .then((res) => res.data.reviews),
      {
        suspense: true,
      }
    );

  const getClosedReviews = () =>
    useSWR(
      '/reviews?status=closed',
      (url) =>
        api
          .get<{ reviews: ReviewWithContentAndParticipant[] }>(url)
          .then((res) => res.data.reviews),
      {
        suspense: true,
      }
    );

  const getReview = (id: string) =>
    useSWR(
      `/reviews/${id}`,
      (url) =>
        api.get<{ review: ReviewWithContentAndParticipant }>(url).then((res) => res.data.review),
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
      getPendingReviews,
      getApprovedReviews,
      getClosedReviews,
      getReview,
      closeReview,
      approveReview,
    }),
    [getPendingReviews, getApprovedReviews, getClosedReviews, getReview, closeReview, approveReview]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useReview = () => useContext(Context);
