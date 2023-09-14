import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ForbiddenException } from '../../exceptions/forbidden.js';
import { asyncHandler } from './asyncHandler.js';

export const collectionExists: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.params.collectionId) return next();

    for (const collection of Object.values(req.schema.collections)) {
      if (collection.id?.toString() === req.params.collectionId) {
        req.collection = collection;
        return next();
      }
    }

    throw new ForbiddenException('forbidden');
  }
);
