import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  field: string;
  label: string;
  required: boolean;
};

export const createField = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    field: yup
      .string()
      .matches(/^[_0-9a-zA-Z]+$/, t('yup.custom.alphanumeric_and_underscore'))
      .required()
      .max(60),
    label: yup.string().required().max(60),
    required: yup.boolean(),
  });
};

export default createField;
