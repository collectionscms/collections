import React, { lazy } from 'react';
import Loader from '../../elements/Loader';

const MinimalLayout = Loader(lazy(() => import('../../layouts/Minimal')));
const NotFound = Loader(lazy(() => import('../../../pages/NotFound')));

const NoRoutes = () => {
  return {
    path: '/admin',
    element: <MinimalLayout />,
    children: [{ path: '*', element: <NotFound /> }],
  };
};

export default NoRoutes;
