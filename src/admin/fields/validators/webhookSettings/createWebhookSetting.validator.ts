import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';
import { urlSchema } from '../shared/urlSchema.js';

export type FormValues = {
  name: string;
  provider: string;
  url: string;
  onPublish: boolean;
  onArchive: boolean;
  onDeletePublished: boolean;
  onRestorePublished: boolean;
};

export const createWebhookSettingValidator = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(250),
    provider: yup.string().required(),
    url: urlSchema(t).required(),
    onPublish: yup.boolean().required(),
    onArchive: yup.boolean().required(),
    onDeletePublished: yup.boolean().required(),
    onRestorePublished: yup.boolean().required(),
  });
};
