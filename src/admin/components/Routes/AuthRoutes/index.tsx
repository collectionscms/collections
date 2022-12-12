import Loader from '@admin/components/elements/Loader';
import MinimalLayout from '@admin/components/layouts/Minimal';
import React, { lazy } from 'react';

const CreateFirstUser = Loader(lazy(() => import('@admin/pages/CreateFirstUser')));
const Login = Loader(lazy(() => import('@admin/pages/Login')));
const Logout = Loader(lazy(() => import('@admin/pages/Logout')));
const Forgot = Loader(lazy(() => import('@admin/pages/Forgot')));

const AuthRoutes = {
  path: '/admin/auth',
  element: <MinimalLayout />,
  children: [
    {
      path: 'create-first-user',
      element: <CreateFirstUser />,
    },
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
  ],
};

export default AuthRoutes;
