import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  primaryLocale: string;
};

export const updatePrimaryLocale = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    primaryLocale: yup.string().required(),
  });
};
