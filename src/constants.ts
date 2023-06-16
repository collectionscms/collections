import { CookieOptions } from 'express';
import ms from 'ms';
import { env } from './env.js';

export const cookieOptions: CookieOptions = {
  path: '/',
  httpOnly: true,
  maxAge: ms(env.REFRESH_TOKEN_TTL as string),
  secure: env.COOKIE_SECURE ?? false,
  sameSite: (env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'strict',
  domain: env.COOKIE_DOMAIN,
};
