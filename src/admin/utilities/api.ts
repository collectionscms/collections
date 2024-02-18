import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-store',
  },
});

export const setAcceptLanguage = (language: string) => {
  api.defaults.headers.common['accept-language'] = language;
};
