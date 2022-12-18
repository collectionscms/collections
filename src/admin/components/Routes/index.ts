import { useRoutes } from 'react-router-dom';
import AuthRoutes from './Auth';
import MainRoutes from './Main';

export default function Routes() {
  return useRoutes([MainRoutes, AuthRoutes]);
}
