import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';
import { FormValues } from './values.js';

export const createWebhookSettingValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(60),
    enabled: yup.boolean().required(),
    provider: yup.string().required(),
    url: yup.string().nullable().url(),
    onPublish: yup.boolean().required(),
    onArchive: yup.boolean().required(),
    onDeletePublished: yup.boolean().required(),
  });
};
