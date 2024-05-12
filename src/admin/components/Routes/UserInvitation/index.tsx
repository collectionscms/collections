import React from 'react';
import lazy from '../../../utilities/lazy.js';
import { Loader } from '../../elements/Loader/index.js';

const MinimalLayout = Loader(lazy(() => import('../../layouts/Minimal/index.js'), 'MinimalLayout'));
const UserInvitation = Loader(
  lazy(() => import('../../../pages/UserInvitation/index.js'), 'UserInvitation')
);

export const UserInvitationRoutes = () => {
  return {
    path: '/admin',
    element: <MinimalLayout />,
    children: [
      {
        path: 'invitations',
        element: <UserInvitation />,
      },
    ],
  };
};
