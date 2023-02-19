import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  name: string;
};

export const updateProjectSetting = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(100),
  });
};

export default updateProjectSetting;
