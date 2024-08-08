import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';
import { TFunction } from 'i18next';

export type FormValues = {
  slug: string;
};

export const updateSlugValidator = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    slug: yup
      .string()
      .matches(/^[a-zA-Z0-9-_]+$/, {
        message: t('yup.custom.alphanumeric_and_underscore_hyphens'),
        excludeEmptyString: true,
      })
      .required()
      .max(100),
  });
};
