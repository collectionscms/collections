import { SchemaOverview, ModelOverview } from '../api/database/overview.js';

export {};

declare global {
  namespace Express {
    export interface Request {
      token: string | null;
      userId?: string | null;
      roleId?: string | null;
      adminAccess?: boolean | null;
      appAccess?: boolean | null;
      permissions?: Permission[] | null;
      schema: SchemaOverview;
      model: ModelOverview;
    }
  }
}
