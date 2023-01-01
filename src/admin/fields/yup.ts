import * as yup from 'yup';
import { LocaleObject } from 'yup/lib/locale';

export const Yup = (locale?: LocaleObject) => {
  if (locale) yup.setLocale(locale);
  return yup;
};

export default Yup;
