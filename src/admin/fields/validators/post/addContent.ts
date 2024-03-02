import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  locale: string;
};

export const addContent = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    locale: yup.string().required(),
  });
};
