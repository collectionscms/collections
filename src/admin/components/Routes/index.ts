import { useRoutes } from 'react-router-dom';
import AuthRoutes from './Auth';
import CollectionRoutes from './Collection';
import MainRoutes from './Main';

export default function Routes() {
  return useRoutes([MainRoutes, CollectionRoutes, AuthRoutes]);
}
