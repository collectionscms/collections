import { ObjectSchema } from 'yup';
import yup from '../../yup';

export type FormValues = {
  key: string;
  value: string;
};

export const createChoice = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    key: yup.string().required().max(60),
    value: yup.string().required().max(60),
  });
};

export default createChoice;
