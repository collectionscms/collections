import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  key: string;
};

export const updateApiKeySchema = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(60),
    key: yup.string().required().max(250),
  });
};
