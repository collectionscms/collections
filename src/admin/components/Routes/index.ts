import { useRoutes } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes';

export default function Routes() {
  return useRoutes([MainRoutes, AuthRoutes]);
}
