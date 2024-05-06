import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  roleId: string;
};

export const createUser = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(250),
    email: yup.string().required().email().max(250),
    password: yup
      .string()
      .matches(/[a-zA-z0-9@$!%*#?&]+/, t('yup.custom.alphanumeric_and_special_character'))
      .required()
      .min(4)
      .max(250),
    isActive: yup.boolean().required(),
    roleId: yup.string().required(),
  });
};
