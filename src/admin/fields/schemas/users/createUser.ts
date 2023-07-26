import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  email: string;
  password: string;
  is_active: boolean;
  api_key?: string | null;
  role_id: string;
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
    api_key: yup.string().notRequired().max(250),
    is_active: yup.boolean().required(),
    role_id: yup.string().required(),
  });
};
