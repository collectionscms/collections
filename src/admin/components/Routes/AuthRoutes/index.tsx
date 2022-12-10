import Loader from '@admin/components/elements/Loader';
import MinimalLayout from '@admin/components/layouts/Minimal';
import React, { lazy } from 'react';

const CreateFirstUser = Loader(lazy(() => import('@admin/components/views/CreateFirstUser')));
const Login = Loader(lazy(() => import('@admin/components/views/Login')));
const Forgot = Loader(lazy(() => import('@admin/components/views/Forgot')));

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
  ],
};

export default AuthRoutes;
