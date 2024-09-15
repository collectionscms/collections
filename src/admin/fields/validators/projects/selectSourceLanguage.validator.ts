import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  sourceLanguage: string;
};

export const selectSourceLanguageValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    sourceLanguage: yup.string().required(),
  });
};
