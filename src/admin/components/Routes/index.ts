import { useRoutes } from 'react-router-dom';
import AppRoutes from './AppRoutes';

export default function Routes() {
  return useRoutes([AppRoutes]);
}
