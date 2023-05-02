import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  isActive: boolean;
  apiKey?: string | null;
  roleId: string;
};

export const createUser = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    firstName: yup.string().required().max(60),
    lastName: yup.string().required().max(60),
    userName: yup
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
    apiKey: yup.string().notRequired().max(250),
    isActive: yup.boolean().required(),
    roleId: yup.string().required(),
  });
};
