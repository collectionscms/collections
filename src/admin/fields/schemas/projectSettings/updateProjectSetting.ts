import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  beforeLogin?: string | null;
  afterLogin?: string | null;
};

export const updateProjectSetting = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(100),
    beforeLogin: yup.string().nullable(),
    afterLogin: yup.string().nullable(),
  });
};
