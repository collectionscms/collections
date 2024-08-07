import axios from 'axios';
import { UploadFile } from '../../types/index.js';

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

export const uploadFile = async (file: File): Promise<{ files: UploadFile[] }> => {
  const params = new FormData();
  params.append('file', file);

  const result = await api.post<{ files: UploadFile[] }>('/files', params);
  return result.data;
};
