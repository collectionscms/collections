import { ObjectSchema } from 'yup';
import { yup } from '../../../yup.js';

export type FormValues = {
  label: string;
  defaultValue: boolean;
};

export const updateBoolean: ObjectSchema<FormValues> = yup.object().shape({
  label: yup.string().required().max(60),
  defaultValue: yup.boolean().required(),
});
