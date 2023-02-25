import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      token: string | null;
      user?: number | null;
      adminAccess?: boolean | null;
      permissions?: Permission[] | null;
    }
  }
}
