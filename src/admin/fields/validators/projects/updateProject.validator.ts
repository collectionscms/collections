import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  sourceLanguage: string;
};

export const updateProjectValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(250),
    sourceLanguage: yup.string().required(),
  });
};
