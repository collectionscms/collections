import { useRoutes } from 'react-router-dom';
import AuthRoutes from './Auth';
import CollectionRoutes from './Collection';
import RootRoutes from './Root';
import SettingRoutes from './Setting';

const Routes = () => {
  return useRoutes([RootRoutes, CollectionRoutes(), SettingRoutes, AuthRoutes]);
};

export default Routes;
