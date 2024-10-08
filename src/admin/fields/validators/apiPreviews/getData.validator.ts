import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  path: string;
};

export const getDataValidator: ObjectSchema<FormValues> = yup.object().shape({
  path: yup.string().required(),
});
