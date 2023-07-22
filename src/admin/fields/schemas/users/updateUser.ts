import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  email: string;
  password?: string | null;
  is_active: boolean;
  api_key?: string | null;
  role_id: string;
};

export const updateUser = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(250),
    email: yup.string().required().email().max(250),
    password: yup
      .string()
      .notRequired()
      .matches(/[a-zA-z]+/, { message: t('yup.custom.one_character'), excludeEmptyString: true })
      .matches(/[0-9]+/, { message: t('yup.custom.one_number'), excludeEmptyString: true })
      .matches(/[@$!%*#?&]+/, {
        message: t('yup.custom.one_special_character'),
        excludeEmptyString: true,
      })
      .min(8)
      .max(250)
      .transform((value) => value || null),
    api_key: yup
      .string()
      .notRequired()
      .max(250)
      .transform((value) => value || null),
    is_active: yup.boolean().required(),
    role_id: yup.string().required(),
  });
};
