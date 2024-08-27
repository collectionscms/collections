import React from 'react';
import { Navigate } from 'react-router-dom';
import { NavContentLayout } from '../../layouts/NavContentLayout/index.js';

export const TenantRootRoutes = () => {
  const children = [{ path: '', element: <Navigate to="/admin/posts" replace /> }];

  return {
    path: '/admin',
    element: <NavContentLayout variable="tenant" />,
    children,
  };
};
