import { SchemaOf } from 'yup';
import yup from '../yup';

export type FormValues = {
  email: string;
  password: string;
};

export const loginSchema: SchemaOf<FormValues> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default loginSchema;
