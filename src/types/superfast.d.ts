import { Response } from 'express';
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

  interface Window {
    Hooks: typeof Hooks;
  }
}
