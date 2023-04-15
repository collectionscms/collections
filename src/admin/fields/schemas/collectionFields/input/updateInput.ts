import { ObjectSchema } from 'yup';
import yup from '../../../yup';

export type FormValues = {
  label: string;
  required: boolean;
  readonly: boolean;
  hidden: boolean;
};

export const updateInput: ObjectSchema<FormValues> = yup.object().shape({
  label: yup.string().required().max(60),
  required: yup.boolean(),
  readonly: yup.boolean(),
  hidden: yup.boolean(),
});
