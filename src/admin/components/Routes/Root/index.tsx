import React from 'react';
import { Navigate } from 'react-router-dom';

const RootRoutes = {
  path: '/admin',
  children: [
    {
      path: '',
      element: <Navigate to="/admin/auth/login" replace />,
    },
  ],
};

export default RootRoutes;
