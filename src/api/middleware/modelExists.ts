import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ForbiddenException } from '../../exceptions/forbidden.js';
import { asyncHandler } from './asyncHandler.js';

export const modelExists: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const identifier = req.params.identifier;
    if (!identifier) return next();

    for (const model of Object.values(req.schema.models)) {
      if (
        model.id?.toString() === identifier ||
        model.model.toLowerCase() === identifier.toLowerCase()
      ) {
        req.model = model;
        return next();
      }
    }

    throw new ForbiddenException('forbidden');
  }
);
