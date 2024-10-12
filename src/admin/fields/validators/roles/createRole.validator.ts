import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  description?: string | null;
  permissions: string[];
};

export const createRoleValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(250),
    description: yup.string().notRequired(),
    permissions: yup.array().of(yup.string().required()).min(0).required(),
  });
};
