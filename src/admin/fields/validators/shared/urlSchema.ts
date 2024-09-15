import { TFunction } from 'i18next';
import { yup } from '../../yup.js';

export const urlSchema = (t: TFunction) =>
  yup.string().test('is-url-or-localhost', t('yup.string.url'), (value) => {
    if (!value) return false;
    const urlPattern = /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$/;
    return urlPattern.test(value) || yup.string().url().isValidSync(value);
  });
