import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  password: string;
  token: string;
};

export const resetPasswordValidator = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    password: yup
      .string()
      .matches(/[a-zA-z0-9@$!%*#?&]+/, t('yup.custom.alphanumeric_and_special_character'))
      .required()
      .min(4)
      .max(250)
      .required(),
    token: yup.string().required(),
  });
};
