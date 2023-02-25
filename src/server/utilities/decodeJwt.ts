import { AuthUser } from '@shared/types';
import jwtDecode from 'jwt-decode';

export const decodeJwt = (token: string): AuthUser => {
  try {
    return jwtDecode<AuthUser>(token);
  } catch {
    return null;
  }
};
