import { NextFunction, Request, RequestHandler, Response } from 'express';

export const extractTokenHandler: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Extract token from query string, ?access_token=123
  if (req.query && req.query.access_token) {
    req.token = req.query.access_token as string;
    return next();
  }

  // Extract token from authentication headers, Bearer <token>
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');

    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      req.token = parts[1];
      return next();
    }
  }

  next();
};
