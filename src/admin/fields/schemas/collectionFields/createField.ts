import { TFunction } from 'i18next';
import { FieldOption } from 'shared/types';
import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  field: string;
  label: string;
  required: boolean;
  options: FieldOption;
};

export const createField = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    field: yup
      .string()
      .matches(/^[_0-9a-z]+$/, t('yup.custom.lower_case_alphanumerics_and_underscore'))
      .required()
      .max(60),
    label: yup.string().required().max(60),
    required: yup.boolean(),
    options: yup.object().shape({
      choices: yup.array(),
    }),
  });
};

export default createField;
