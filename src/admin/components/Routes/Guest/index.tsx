import React from 'react';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';

const MinimalLayout = Loader(lazy(() => import('../../layouts/Minimal/index.js'), 'MinimalLayout'));
const SignUp = Loader(lazy(() => import('../../../pages/SignUp/index.js'), 'SignUp'));

export const GuestRoutes = () => {
  return {
    path: '/admin',
    element: <MinimalLayout />,
    children: [
      {
        path: 'invitations/accept',
        element: <SignUp />,
      },
    ],
  };
};
