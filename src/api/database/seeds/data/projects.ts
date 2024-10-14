import { v4 } from 'uuid';

export const enProject = v4();
export const jpProject = v4();

export const projects = [
  {
    id: enProject,
    subdomain: 'en',
    description: null,
    enabled: true,
    sourceLanguage: 'en-us',
    iconUrl: null,
    name: 'English Project',
  },
  {
    id: jpProject,
    subdomain: 'ja',
    description: null,
    enabled: true,
    sourceLanguage: 'ja',
    iconUrl: null,
    name: '日本語プロジェクト',
  },
];
