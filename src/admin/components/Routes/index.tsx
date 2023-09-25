import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Loading } from '../elements/Loading/index.js';
import { useAuth } from '../utilities/Auth/index.js';
import { AuthRoutes } from './Auth/index.js';
import { ModelRoutes } from './Model/index.js';
import { NoRoutes } from './NoRoutes/index.js';
import { RootRoutes } from './Root/index.js';
import { SettingRoutes } from './Setting/index.js';

export const Routes: React.FC = () => {
  const { user } = useAuth();
  const router = createBrowserRouter([
    RootRoutes(),
    ModelRoutes(),
    SettingRoutes(),
    AuthRoutes,
    NoRoutes(),
  ]);

  if (user === undefined) return <Loading />;

  return <RouterProvider router={router} />;
};
