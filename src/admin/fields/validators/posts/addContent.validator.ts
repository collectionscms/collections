import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  language: string;
};

export const addContentValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    language: yup.string().required(),
  });
};
