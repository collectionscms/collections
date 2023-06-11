import jwtDecode from 'jwt-decode';
import { AuthUser } from '../../config/types.js';

type DecodedType = AuthUser & { exp: number };

export const decodeJwt = (token: string): DecodedType | null => {
  try {
    return jwtDecode<DecodedType>(token);
  } catch {
    return null;
  }
};
