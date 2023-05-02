import { ObjectSchema } from 'yup';
import { yup } from '../../../yup.js';

export type FormValues = {
  label: string;
  required: boolean;
  readonly: boolean;
  hidden: boolean;
  choices?: Record<string, any>[] | null;
};

export const updateSelectDropdown: ObjectSchema<FormValues> = yup.object().shape({
  label: yup.string().required().max(60),
  required: yup.boolean().required(),
  readonly: yup.boolean().required(),
  hidden: yup.boolean().required(),
  choices: yup.array(),
});
