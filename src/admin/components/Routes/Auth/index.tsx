import React from 'react';
import { Loader } from '../../../components/elements/Loader/index.js';
import lazy from '../../../utilities/lazy.js';

const MinimalLayout = Loader(lazy(() => import('../../layouts/Minimal/index.js'), 'MinimalLayout'));
const Login = Loader(lazy(() => import('../../../pages/Login/index.js'), 'Login'));
const Logout = Loader(lazy(() => import('../../../pages/Logout/index.js'), 'Logout'));
const LogoutInactivity = Loader(
  lazy(() => import('../../../pages/LogoutInactivity/index.js'), 'LogoutInactivity')
);
const ForgotPassword = Loader(
  lazy(() => import('../../../pages/ForgotPassword/index.js'), 'ForgotPassword')
);
const ResetPassword = Loader(
  lazy(() => import('../../../pages/ResetPassword/index.js'), 'ResetPassword')
);

export const AuthRoutes = {
  path: '/admin/auth',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'forgot',
      element: <ForgotPassword />,
    },
    {
      path: 'logout',
      element: <Logout />,
    },
    {
      path: 'logout-inactivity',
      element: <LogoutInactivity />,
    },
    {
      path: 'reset-password/:token',
      element: <ResetPassword />,
    },
  ],
};
