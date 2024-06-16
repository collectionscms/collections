import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
};

export const updateProject = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(100),
  });
};
