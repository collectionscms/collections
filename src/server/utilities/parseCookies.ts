import { Request } from 'express';

export function parseCookies(req: Request): { [key: string]: string } {
  const list: Record<string, string> = {};
  const cookies = req.headers.cookie;

  if (cookies) {
    cookies.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      const key = parts.shift()?.trim();
      if (key) {
        list[key] = decodeURI(parts.join('='));
      }
    });
  }

  return list;
}
