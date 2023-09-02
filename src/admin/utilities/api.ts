import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { ApiError } from '../config/types.js';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-store',
  },
});

export const setAuthorization = (token: string) => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeAuthorization = () => {
  delete api.defaults.headers.common.Authorization;
};

/**
 * When an expired access token is detected, the function will attempt to
 * refresh the token and retry the request. If the token refresh fails, the
 * function will call the provided onError function.
 *
 * 401(token_expired): Retry after request token.
 * 500: Retry the request three times.
 * other: No retry.
 *
 * @param onRequestToken A function that returns a new access token.
 * @param onError A function that is called when the token refresh fails.
 */
export const attachRetry = (onRequestToken: () => Promise<string | null>, onError: () => void) => {
  axiosRetry(api, {
    retryCondition: async (error: AxiosError) => {
      const apiError = error.response?.data as ApiError;
      if (!apiError) return false;

      if (apiError.code === 'token_expired') {
        delete error.config!.headers.Authorization;
        removeAuthorization();

        const token = await onRequestToken();
        if (!token) {
          onError();
          return false;
        }

        error.config!.headers.Authorization = `Bearer ${token}`;
        setAuthorization(token);

        return true;
      } else if (apiError.status === 500) {
        return true;
      } else {
        return false;
      }
    },
  });
};
