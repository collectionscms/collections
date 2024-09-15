import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  permissions: string[];
};

export const createApiKeyValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(60),
    permissions: yup.array().of(yup.string().required()).min(1).required(),
  });
};
