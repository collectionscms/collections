import { TextField } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Props } from '../types';

const InputMultiline: React.FC<Props> = ({ register, errors, field }) => {
  const { t } = useTranslation();
  const required = field.required && { required: t('yup.mixed.required') };

  return (
    <TextField
      type="text"
      multiline
      rows={5}
      name={field.field}
      {...register(field.field, { ...required })}
      error={errors[field.field] !== undefined}
      fullWidth
    />
  );
};

export default InputMultiline;
