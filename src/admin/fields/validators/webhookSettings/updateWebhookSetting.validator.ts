import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  url: string | null;
  enabled: boolean;
  onPublish: boolean;
  onArchive: boolean;
  onUpdatePublished: boolean;
  onDeletePublished: boolean;
};

export const updateWebhookSettingValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(60),
    enabled: yup.boolean().required(),
    url: yup.string().url().required(),
    onPublish: yup.boolean().required(),
    onArchive: yup.boolean().required(),
    onUpdatePublished: yup.boolean().required(),
    onDeletePublished: yup.boolean().required(),
  });
};
