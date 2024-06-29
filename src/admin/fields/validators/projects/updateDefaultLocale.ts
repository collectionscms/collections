import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  defaultLocale: string;
};

export const updateDefaultLocale = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    defaultLocale: yup.string().required(),
  });
};
