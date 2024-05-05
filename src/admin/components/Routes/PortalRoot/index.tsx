import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProfilePage } from '../../../pages/Profile/index.js';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainHeader } from '../../elements/MainHeader/index.js';
import { MainLayout } from '../../layouts/Main/index.js';

const ProjectListPage = Loader(
  lazy(() => import('../../../pages/ProjectList/index.js'), 'ProjectListPage')
);

export const PortalRootRoutes = () => {
  const { t } = useTranslation();

  return {
    path: '/admin',
    element: <MainLayout showNavContent={false} />,
    children: [
      {
        path: '',
        element: <ProjectListPage />,
      },
      {
        path: 'me',
        element: (
          <MainHeader label={t('profile')}>
            <ProfilePage />
          </MainHeader>
        ),
      },
    ],
  };
};
