import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { BaseException } from '../../shared/exceptions/base';
import logger from '../../utilities/logger';

// NextFunction must be passed for Express to use this middleware as error handler
/* eslint-disable @typescript-eslint/no-unused-vars */
const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  if (!(err instanceof BaseException)) {
    res.status(500).end();
  }

  const base = err as BaseException;

  if (process.env.NODE_ENV === 'development') {
    base.extensions = {
      ...(base.extensions || {}),
      stack: err.stack,
    };
  }

  return res.status(base.status).json(base.toJson());
};

export default errorHandler;
