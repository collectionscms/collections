import Loader from '@admin/components/elements/Loader';
import MinimalLayout from '@admin/components/layouts/Minimal';
import React, { lazy } from 'react';

const Login = Loader(lazy(() => import('@admin/pages/Login')));
const Logout = Loader(lazy(() => import('@admin/pages/Logout')));
const Forgot = Loader(lazy(() => import('@admin/pages/Forgot')));
const ResetPassword = Loader(lazy(() => import('@admin/pages/ResetPassword')));

const AuthRoutes = {
  path: '/admin/auth',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'forgot',
      element: <Forgot />,
    },
    {
      path: 'logout',
      element: <Logout />,
    },
    {
      path: 'reset-password',
      element: <ResetPassword />,
    },
  ],
};

export default AuthRoutes;
