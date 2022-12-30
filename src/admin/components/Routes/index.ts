import { useRoutes } from 'react-router-dom';
import AuthRoutes from './Auth';
import CollectionRoutes from './Collection';
import RootRoutes from './Root';
import SettingRoutes from './Setting';
import UserRoutes from './User';

const Routes = () => {
  return useRoutes([RootRoutes, CollectionRoutes(), UserRoutes, SettingRoutes, AuthRoutes]);
};

export default Routes;
