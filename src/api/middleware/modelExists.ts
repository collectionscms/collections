import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ForbiddenException } from '../../exceptions/forbidden.js';
import { asyncHandler } from './asyncHandler.js';

export const modelExists: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.params.modelId) return next();

    for (const model of Object.values(req.schema.models)) {
      if (model.id?.toString() === req.params.modelId) {
        req.model = model;
        return next();
      }
    }

    throw new ForbiddenException('forbidden');
  }
);
