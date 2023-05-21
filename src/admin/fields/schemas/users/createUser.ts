import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  password: string;
  is_active: boolean;
  api_key?: string | null;
  role_id: string;
};

export const createUser = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    first_name: yup.string().required().max(60),
    last_name: yup.string().required().max(60),
    user_name: yup
      .string()
      .matches(/^[_0-9a-zA-Z]+$/, t('yup.custom.alphanumeric_and_underscore'))
      .required()
      .max(60),
    email: yup.string().required().email().max(250),
    password: yup
      .string()
      .matches(/[a-zA-z]+/, t('yup.custom.one_character'))
      .matches(/[0-9]+/, t('yup.custom.one_number'))
      .matches(/[@$!%*#?&]+/, t('yup.custom.one_special_character'))
      .required()
      .min(8)
      .max(250),
    api_key: yup.string().notRequired().max(250),
    is_active: yup.boolean().required(),
    role_id: yup.string().required(),
  });
};
