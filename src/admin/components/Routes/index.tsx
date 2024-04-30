import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { getLoginUrl } from '../../utilities/urlGenerator.js';
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
    SettingRoutes(me),
    AuthRoutes,
    NoRoutes(),
  ]);

  if (me === undefined) return <Loading />;

  const loginUrl = getLoginUrl();
  if (me === null && window.location.href !== loginUrl) {
    window.location.href = loginUrl;
  }

  return <RouterProvider router={router} />;
};
