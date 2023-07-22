import { Request } from 'express';
import { env } from '../../env.js';
import { parseCookies } from './parseCookies.js';

// Extract token from cookies
export const getExtractJwt = (req: Request): string | null => {
  const cookies = parseCookies(req);
  const tokenCookieName = `${env.COOKIE_PREFIX}-refresh-token`;

  if (cookies && cookies[tokenCookieName]) {
    return cookies[tokenCookieName];
  }

  return null;
};
