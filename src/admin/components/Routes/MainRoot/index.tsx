import React from 'react';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { MainLayout } from '../../layouts/Main/index.js';

const ProjectListPage = Loader(
  lazy(() => import('../../../pages/ProjectList/index.js'), 'ProjectListPage')
);

export const MainRootRoutes = {
  path: '/admin',
  element: <MainLayout showNavContent={false} />,
  children: [
    {
      path: '',
      element: <ProjectListPage />,
    },
  ],
};
