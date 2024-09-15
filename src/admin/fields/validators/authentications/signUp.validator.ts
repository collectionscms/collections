import { t } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  email: string;
  password: string;
  token?: string | null;
};

export const signUpValidator: ObjectSchema<FormValues> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .matches(/[a-zA-z0-9@$!%*#?&]+/, {
      message: t('yup.custom.alphanumeric_and_special_character'),
      excludeEmptyString: true,
    })
    .min(4)
    .max(250),
  token: yup.string().nullable(),
});
