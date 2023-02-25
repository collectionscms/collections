import { NextFunction, Request, Response, RequestHandler } from 'express';

const extractTokenHandler: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  let token: string | null = null;

  if (req.query && req.query.access_token) {
    token = req.query.access_token as string;
  }

  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');

    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      token = parts[1];
    }
  }

  req.token = token;
  next();
};

export default extractTokenHandler;
