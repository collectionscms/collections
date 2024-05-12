import React from 'react';
import { Navigate } from 'react-router-dom';

export const NavigateLoginRoutes = () => {
  return {
    path: '/admin',
    children: [
      { path: '', element: <Navigate to="/admin/auth/login" replace /> },
      { path: '*', element: <Navigate to="/admin/auth/login" replace /> },
    ],
  };
};
