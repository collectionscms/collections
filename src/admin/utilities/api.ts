import axios from 'axios';

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
