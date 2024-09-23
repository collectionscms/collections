import React from 'react';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { ActivityBarLayout } from '../../layouts/ActivityBarLayout/index.js';
import { t } from 'i18next';
import { MainHeader } from '../../elements/MainHeader/index.js';

const ProjectListPage = Loader(
  lazy(() => import('../../../pages/ProjectList/index.js'), 'ProjectListPage')
);

export const PortalRootRoutes = () => {
  return {
    path: '/admin',
    element: <ActivityBarLayout />,
    children: [
      {
        path: '',
        element: (
          <MainHeader label={t('project')}>
            <ProjectListPage />
          </MainHeader>
        ),
      },
    ],
  };
};
