import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader } from '../../../components/elements/Loader/index.js';
import lazy from '../../../utilities/lazy.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { NavContentLayout } from '../../layouts/NavContentLayout/index.js';

const Template = Loader(lazy(() => import('../../../pages/Template/index.js'), 'TemplatePage'));

export const ExtensionsRoutes = () => {
  const { t } = useTranslation();

  return {
    path: '/admin',
    element: <NavContentLayout variable="tenant" />,
    children: [
      {
        path: 'templates',
        element: (
          <MainHeader label={t('template')}>
            <Template />
          </MainHeader>
        ),
      },
    ],
  };
};
