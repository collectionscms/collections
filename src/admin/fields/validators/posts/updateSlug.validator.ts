import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  slug: string;
};

export const updateSlugValidator = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    slug: yup
      .string()
      .required()
      .matches(/^[a-z0-9-]+$/, t('yup.custom.alphanumeric_and_hyphens'))
      .max(250),
  });
};
