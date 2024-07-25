import { NextFunction, Request, RequestHandler, Response } from 'express';

export const extractToken: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
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
