import { Response } from 'express';
import UserSession from '../server/models/user-session.model';
import User from '../server/models/user.model';
import Hooks from '../shared/features/hooks';

// Extensible types / declarations for hooks
declare global {
  namespace Superfast {
    interface IActions {
      'server/init': [Express];
      'api/init': [Express];

      [key: string]: any[];
    }

    interface IFilters {
      'server/notFound': [Response];

      [key: string]: any[];
    }
  }

  namespace Express {
    interface Request {
      data: {
        user?: User;
        session?: UserSession;
        [key: string]: any;
      };

      validate: (schema: any, type?: 'body' | 'query' | 'params') => Promise<void>;
    }

    namespace Multer {
      interface File {
        key?: string;
      }
    }
  }

  interface Window {
    Hooks: typeof Hooks;
  }
}
