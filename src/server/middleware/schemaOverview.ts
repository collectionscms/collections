import { NextFunction, Request, RequestHandler, Response } from 'express';
import { getSchemaOverview } from '../database/overview.js';
import { asyncHandler } from './asyncHandler.js';

export const schemaOverview: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    req.schema = await getSchemaOverview();
    return next();
  }
);
