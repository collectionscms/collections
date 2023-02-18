import { TextField } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Props } from '../types';

const Input: React.FC<Props> = ({ register, errors, field: meta }) => {
  const { t } = useTranslation();
  const required = meta.required && { required: t('yup.mixed.required') };

  return (
    <TextField
      type="text"
      name={meta.field}
      {...register(meta.field, { ...required })}
      error={errors[meta.field] !== undefined}
      fullWidth
    />
  );
};

export default Input;
