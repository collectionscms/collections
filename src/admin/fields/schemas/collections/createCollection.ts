import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  name: string;
  singleton: boolean;
};

export const createCollection = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup
      .string()
      .matches(/^[_0-9a-zA-Z]+$/, t('yup.custom.alphanumeric_and_underscore'))
      .required()
      .max(60),
    singleton: yup.boolean(),
  });
};

export default createCollection;
