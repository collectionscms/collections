import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export const updateMetaValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    metaTitle: yup.string().nullable().max(250),
    metaDescription: yup.string().nullable(),
  });
};
