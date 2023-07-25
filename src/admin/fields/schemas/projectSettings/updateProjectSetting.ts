import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  before_login?: string | null;
  after_login?: string | null;
};

export const updateProjectSetting = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(100),
    before_login: yup.string().nullable(),
    after_login: yup.string().nullable(),
  });
};
