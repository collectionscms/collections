import { LocaleObject } from 'yup/lib/locale';
import { Yup } from './yup';

export const loginSchema = (locale?: LocaleObject) => {
  const yup = Yup(locale);
  return yup.object({
    email: yup.string().required().email(),
    password: yup.string().required(),
  });
};
