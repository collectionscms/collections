import React from 'react';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';

const MinimalLayout = Loader(lazy(() => import('../../layouts/Minimal/index.js'), 'MinimalLayout'));
const VerifyInvitation = Loader(
  lazy(() => import('../../../pages/VerifyInvitation/index.js'), 'VerifyInvitation')
);

export const VerifyInvitationRoutes = () => {
  return {
    path: '/admin',
    element: <MinimalLayout />,
    children: [
      {
        path: 'verify-invitation',
        element: <VerifyInvitation />,
      },
    ],
  };
};
