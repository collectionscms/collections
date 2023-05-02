import { ObjectSchema } from 'yup';
import { yup } from '../../../yup.js';

export type FormValues = {
  label: string;
  value: string;
};

export const createChoice: ObjectSchema<FormValues> = yup.object().shape({
  label: yup.string().required().max(60),
  value: yup.string().required().max(60),
});
