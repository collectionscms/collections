import React from 'react';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';

const MinimalLayout = Loader(lazy(() => import('../../layouts/Minimal/index.js'), 'MinimalLayout'));
const AcceptInvitation = Loader(
  lazy(() => import('../../../pages/AcceptInvitation/index.js'), 'AcceptInvitation')
);

export const InvitationRoutes = () => {
  return {
    path: '/admin',
    element: <MinimalLayout />,
    children: [
      {
        path: 'invitations/accept',
        element: <AcceptInvitation />,
      },
    ],
  };
};
