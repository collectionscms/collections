import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  collection: string;
  singleton: boolean;
  status: boolean;
};

export const createCollection = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    collection: yup
      .string()
      .matches(/^[_0-9a-zA-Z]+$/, t('yup.custom.alphanumeric_and_underscore'))
      .required()
      .max(60),
    singleton: yup.boolean().required(),
    status: yup.boolean().required(),
  });
};
