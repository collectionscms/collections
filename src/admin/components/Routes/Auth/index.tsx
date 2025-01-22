import React from 'react';
import { Loader } from '../../../components/elements/Loader/index.js';
import lazy from '../../../utilities/lazy.js';

const MinimalLayout = Loader(lazy(() => import('../../layouts/Minimal/index.js'), 'MinimalLayout'));
const Login = Loader(lazy(() => import('../../../pages/Login/index.js'), 'Login'));
const Logout = Loader(lazy(() => import('../../../pages/Logout/index.js'), 'Logout'));
const VerifyRequest = Loader(
  lazy(() => import('../../../pages/VerifyRequest/index.js'), 'VerifyRequest')
);
export const AuthRoutes = () => {
  return {
    path: '/admin/auth',
    element: <MinimalLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'logout',
        element: <Logout />,
      },
      {
        path: 'verify-request',
        element: <VerifyRequest />,
      },
    ],
  };
};
