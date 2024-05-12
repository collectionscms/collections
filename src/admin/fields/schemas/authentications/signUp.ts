import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  email: string;
  password: string;
  token: string | null;
};

export const signUpSchema: ObjectSchema<FormValues> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  token: yup.string().required(),
});
