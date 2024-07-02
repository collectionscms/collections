import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  defaultLocale: string;
};

export const selectDefaultLocale = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    defaultLocale: yup.string().required(),
  });
};
