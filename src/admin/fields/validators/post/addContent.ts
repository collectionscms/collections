import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  locales: string[];
};

export const addContent = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    locales: yup.array().of(yup.string().required()).min(1).required(),
  });
};
