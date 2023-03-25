import jwtDecode from 'jwt-decode';
import { AuthUser } from '../../shared/types';

export const decodeJwt = (token: string): AuthUser => {
  try {
    return jwtDecode<AuthUser>(token);
  } catch {
    return null;
  }
};
