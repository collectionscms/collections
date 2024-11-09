import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';
import { TFunction } from 'i18next';

export type FormValues = {
  name: string;
  subdomain: string;
  sourceLanguage: string;
};

export const projectSettingsValidator = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(250),
    subdomain: yup
      .string()
      .required()
      .matches(/^[a-z0-9-]+$/, t('yup.custom.alphanumeric_and_hyphens')),
    sourceLanguage: yup.string().required(),
  });
};
