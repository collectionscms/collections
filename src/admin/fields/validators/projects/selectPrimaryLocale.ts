import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  primaryLocale: string;
};

export const selectPrimaryLocale = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    primaryLocale: yup.string().required(),
  });
};
