import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Loading } from '../elements/Loading/index.js';
import { useAuth } from '../utilities/Auth/index.js';
import { AuthRoutes } from './Auth/index.js';
import { CollectionRoutes } from './Collection/index.js';
import { NoRoutes } from './NoRoutes/index.js';
import { RootRoutes } from './Root/index.js';
import { SettingRoutes } from './Setting/index.js';

export const Routes: React.FC = () => {
  const { user } = useAuth();
  const routes = useRoutes([
    RootRoutes(),
    CollectionRoutes(),
    SettingRoutes(),
    AuthRoutes,
    NoRoutes(),
  ]);

  if (user === undefined) return <Loading />;

  return <>{routes}</>;
};
