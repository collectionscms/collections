import React from 'react';
import { Loader } from '../../elements/Loader/index.js';
import lazy from '../../../utilities/lazy.js';

const MinimalLayout = Loader(lazy(() => import('../../layouts/Minimal/index.js'), 'MinimalLayout'));
const NotFound = Loader(lazy(() => import('../../../pages/NotFound/index.js'), 'NotFound'));

export const NoRoutes = () => {
  return {
    path: '/admin',
    element: <MinimalLayout />,
    children: [{ path: '*', element: <NotFound /> }],
  };
};
