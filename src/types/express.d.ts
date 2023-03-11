import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      token: string | null;
      userId?: number | null;
      roleId?: number | null;
      adminAccess?: boolean | null;
      permissions?: Permission[] | null;
    }
  }
}
