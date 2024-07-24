import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  key?: string;
  permissions: string[];
};

export const updateApiKeySchema = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(60),
    key: yup.string().optional().max(250),
    permissions: yup.array().of(yup.string().required()).min(1).required(),
  });
};
