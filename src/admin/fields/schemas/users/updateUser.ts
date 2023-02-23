import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  isActive: boolean;
  apiKey: string;
  roleId: string;
};

export const updateUser = (t: TFunction): ObjectSchema<FormValues> => {
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
      .notRequired()
      .matches(/[a-zA-z]+/, { message: t('yup.custom.one_character'), excludeEmptyString: true })
      .matches(/[0-9]+/, { message: t('yup.custom.one_number'), excludeEmptyString: true })
      .matches(/[@$!%*#?&]+/, {
        message: t('yup.custom.one_special_character'),
        excludeEmptyString: true,
      })
      .min(8)
      .max(250)
      .transform((value) => (!!value ? value : null)),
    apiKey: yup
      .string()
      .notRequired()
      .max(250)
      .transform((value) => (!!value ? value : null)),
    isActive: yup.boolean(),
    roleId: yup.string().required(),
  });
};

export default updateUser;
