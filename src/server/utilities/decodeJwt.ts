import jwtDecode from 'jwt-decode';
import { AuthUser } from '../../config/types.js';

export const decodeJwt = (token: string): AuthUser | null => {
  try {
    return jwtDecode<AuthUser>(token);
  } catch {
    return null;
  }
};
