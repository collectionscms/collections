import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../../yup.js';

export type FormValues = {
  field: string;
  label: string;
  default_value: boolean;
};

export const createBoolean = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    field: yup
      .string()
      .matches(/^[_0-9a-zA-Z]+$/, t('yup.custom.alphanumeric_and_underscore'))
      .required()
      .max(60),
    label: yup.string().required().max(60),
    default_value: yup.boolean().required(),
  });
};
