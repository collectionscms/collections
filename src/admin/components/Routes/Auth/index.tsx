import React, { lazy } from 'react';
import Loader from '../../../components/elements/Loader';
import MinimalLayout from '../../../components/layouts/Minimal';

const Login = Loader(lazy(() => import('../../../pages/Login')));
const Logout = Loader(lazy(() => import('../../../pages/Logout')));
const ForgotPasswordPage = Loader(lazy(() => import('../../../pages/ForgotPassword')));
const ResetPassword = Loader(lazy(() => import('../../../pages/ResetPassword')));

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
      element: <ForgotPasswordPage />,
    },
    {
      path: 'logout',
      element: <Logout />,
    },
    {
      path: 'reset-password/:token',
      element: <ResetPassword />,
    },
  ],
};

export default AuthRoutes;
