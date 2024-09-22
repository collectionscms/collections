import React from 'react';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';

const MinimalLayout = Loader(lazy(() => import('../../layouts/Minimal/index.js'), 'MinimalLayout'));
const Login = Loader(lazy(() => import('../../../pages/Login/index.js'), 'Login'));

export const GuestRoutes = () => {
  return {
    path: '/admin',
    element: <MinimalLayout />,
    children: [
      {
        path: 'invitations/accept',
        element: <Login />,
      },
    ],
  };
};
