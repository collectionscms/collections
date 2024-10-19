import React from 'react';
import { Navigate } from 'react-router-dom';
import { NavContentLayout } from '../../layouts/NavContentLayout/index.js';
import { useAuth } from '../../utilities/Auth/index.js';

export const TenantRootRoutes = () => {
  const { hasPermission } = useAuth();
  const redirectPath =
    hasPermission('readOwnPost') || hasPermission('readAllPost') ? 'posts' : 'templates';
  const children = [{ path: '', element: <Navigate to={`/admin/${redirectPath}`} replace /> }];

  return {
    path: '/admin',
    element: <NavContentLayout variable="tenant" />,
    children,
  };
};
