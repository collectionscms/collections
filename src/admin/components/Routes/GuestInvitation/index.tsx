import React from 'react';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';

const MinimalLayout = Loader(lazy(() => import('../../layouts/Minimal/index.js'), 'MinimalLayout'));
const GuestInvitation = Loader(
  lazy(() => import('../../../pages/GuestInvitation/index.js'), 'GuestInvitation')
);

export const GuestInvitationRoutes = () => {
  return {
    path: '/admin',
    element: <MinimalLayout />,
    children: [
      {
        path: 'invitations',
        element: <GuestInvitation />,
      },
    ],
  };
};
