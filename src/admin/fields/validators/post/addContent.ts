import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  languages: string[];
};

export const addContent = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    languages: yup.array().of(yup.string().required()).min(1).required(),
  });
};
