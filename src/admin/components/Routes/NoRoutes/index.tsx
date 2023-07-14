import React from 'react';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';

const NotFound = Loader(lazy(() => import('../../../pages/NotFound/index.js'), 'NotFound'));

export const NoRoutes = () => {
  return {
    path: '/admin',
    children: [{ path: '*', element: <NotFound /> }],
  };
};
