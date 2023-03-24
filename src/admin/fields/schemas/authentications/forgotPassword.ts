import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  email: string;
};

export const forgotPasswordSchema: ObjectSchema<FormValues> = yup.object().shape({
  email: yup.string().email().required(),
});
