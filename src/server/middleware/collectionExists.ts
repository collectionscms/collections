import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ForbiddenException } from '../../exceptions/forbidden.js';
import { asyncHandler } from './asyncHandler.js';

export const collectionExists: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.params.collection) return next();

    if (req.params.collection in req.schema.collections === false) {
      throw new ForbiddenException('forbidden');
    }

    req.collection = req.schema.collections[req.params.collection];

    return next();
  }
);
