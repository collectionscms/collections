import { TextField } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Props } from '../types.js';

export const InputType: React.FC<Props> = ({
  form: {
    register,
    formState: { errors },
  },
  field,
}) => {
  const { t } = useTranslation();
  const required = field.required && { required: t('yup.mixed.required') };

  return (
    <TextField
      type="text"
      disabled={Boolean(field.readonly)}
      {...register(field.field, { ...required })}
      error={errors[field.field] !== undefined}
      fullWidth
    />
  );
};
