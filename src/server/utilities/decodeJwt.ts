import _jwtDecode from 'jwt-decode';
import { AuthUser } from '../../config/types.js';

const jwtDecode = _jwtDecode as unknown as typeof _jwtDecode.default;

export const decodeJwt = (token: string): AuthUser | null => {
  try {
    return jwtDecode<AuthUser>(token);
  } catch {
    return null;
  }
};
