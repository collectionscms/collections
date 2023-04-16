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

  const base = err as BaseException;
  if (base?.status === undefined) {
    return res
      .status(500)
      .json({ status: 500, code: 'internal_server_error', stack: [err.message] });
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
