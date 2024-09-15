import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  email: string;
  password: string;
  csrfToken: string;
};

export const loginValidator: ObjectSchema<FormValues> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  csrfToken: yup.string().required(),
});
