import { ObjectSchema } from 'yup';
import { yup } from '../../../yup.js';

export type FormValues = {
  label: string;
  default_value: boolean;
  required: boolean;
  readonly: boolean;
  hidden: boolean;
};

export const updateBoolean: ObjectSchema<FormValues> = yup.object().shape({
  label: yup.string().required().max(60),
  default_value: yup.boolean().required(),
  required: yup.boolean().required(),
  readonly: yup.boolean().required(),
  hidden: yup.boolean().required(),
});
