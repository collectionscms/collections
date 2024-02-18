import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Loading } from '../elements/Loading/index.js';
import { useAuth } from '../utilities/Auth/index.js';
import { AuthRoutes } from './Auth/index.js';
import { NoRoutes } from './NoRoutes/index.js';
import { PostRoutes } from './Post/index.js';
import { RootRoutes } from './Root/index.js';
import { SettingRoutes } from './Setting/index.js';

export const Routes: React.FC = () => {
  const { me } = useAuth();
  const router = createBrowserRouter([
    RootRoutes(),
    PostRoutes(),
    SettingRoutes(),
    AuthRoutes,
    NoRoutes(),
  ]);

  if (me === undefined) return <Loading />;

  return <RouterProvider router={router} />;
};
