import { resources } from '../lang/translations/config';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources['ja'];
  }
}
