import MinimalLayout from '@admin/components/layouts/Minimal';
import CreateFirstUser from '@admin/components/views/CreateFirstUser';
import React from 'react';

const AuthRoutes = {
  path: '/admin/auth',
  element: <MinimalLayout />,
  children: [
    {
      path: 'create-first-user',
      element: <CreateFirstUser />,
    },
  ],
};

export default AuthRoutes;
