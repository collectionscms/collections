import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  key?: string;
  permissions: string[];
};

export const updateApiKeyValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(250),
    key: yup.string().optional().max(250),
    permissions: yup.array().of(yup.string().required()).min(1).required(),
  });
};
