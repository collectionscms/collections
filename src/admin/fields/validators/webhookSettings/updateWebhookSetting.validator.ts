import { TFunction } from 'i18next';
import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';
import { urlSchema } from '../shared/urlSchema.js';

export type FormValues = {
  name: string;
  url: string | null;
  enabled: boolean;
  onPublish: boolean;
  onArchive: boolean;
  onDeletePublished: boolean;
  onRestorePublished: boolean;
};

export const updateWebhookSettingValidator = (t: TFunction): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(60),
    enabled: yup.boolean().required(),
    url: urlSchema(t).required(),
    onPublish: yup.boolean().required(),
    onArchive: yup.boolean().required(),
    onDeletePublished: yup.boolean().required(),
    onRestorePublished: yup.boolean().required(),
  });
};
