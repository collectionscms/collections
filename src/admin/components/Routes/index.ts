import { useRoutes } from 'react-router-dom';
import { AuthRoutes } from './Auth/index.js';
import { CollectionRoutes } from './Collection/index.js';
import { NoRoutes } from './NoRoutes/index.js';
import { RootRoutes } from './Root/index.js';
import { SettingRoutes } from './Setting/index.js';

export const Routes = () => {
  return useRoutes([RootRoutes(), CollectionRoutes(), SettingRoutes(), AuthRoutes, NoRoutes()]);
};
