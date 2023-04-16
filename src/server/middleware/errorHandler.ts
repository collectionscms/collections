import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { BaseException } from '../../shared/exceptions/base';
import logger from '../../utilities/logger';

// NextFunction must be passed for Express to use this middleware as error handler
/* eslint-disable no-unused-vars */
const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err);

  let base = err as BaseException;
  if (base?.status === undefined) {
    base = new BaseException(500, 'internal_server_error');
    base.extensions = {
      message: err.message,
    };
  }

  if (process.env.NODE_ENV === 'development') {
    base.extensions = {
      ...(base.extensions || {}),
      stack: err.stack,
    };
  }
  return res.status(base.status).json(base.toJson());
};

export default errorHandler;
