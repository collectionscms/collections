import React from 'react';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';
import { SidebarLayout } from '../../layouts/Sidebar/index.js';

const ProjectListPage = Loader(
  lazy(() => import('../../../pages/ProjectList/index.js'), 'ProjectListPage')
);

export const PortalRootRoutes = () => {
  return {
    path: '/admin',
    element: <SidebarLayout variable="portal" />,
    children: [
      {
        path: '',
        element: <ProjectListPage />,
      },
    ],
  };
};
