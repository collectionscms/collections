import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  password: string;
  token: string;
};

export const resetPasswordSchema = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    password: yup
      .string()
      .matches(/[a-zA-z]+/, t('yup.custom.one_character'))
      .matches(/[0-9]+/, t('yup.custom.one_number'))
      .matches(/[@$!%*#?&]+/, t('yup.custom.one_special_character'))
      .required()
      .min(8)
      .max(250),
    token: yup.string(),
  });
};
