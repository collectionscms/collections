import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  email: string;
  password: string;
  app_access: boolean;
};

export const loginSchema: ObjectSchema<FormValues> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  app_access: yup.boolean().required(),
});
