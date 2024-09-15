import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';
import { urlValidation } from '../shared/urlValidation.js';

export type FormValues = {
  name: string;
  provider: string;
  url: string;
  onPublish: boolean;
  onArchive: boolean;
  onDeletePublished: boolean;
};

export const createWebhookSettingValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(60),
    provider: yup.string().required(),
    url: urlValidation.required(),
    onPublish: yup.boolean().required(),
    onArchive: yup.boolean().required(),
    onDeletePublished: yup.boolean().required(),
  });
};
