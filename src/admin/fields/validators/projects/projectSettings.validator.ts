import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  subdomain: string;
};

export const projectSettingsValidator = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(250),
    subdomain: yup.string().required(),
  });
};
