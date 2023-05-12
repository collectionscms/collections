import { Checkbox } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Props } from '../types.js';

export const BooleanType: React.FC<Props> = ({ form: { control }, field: meta }) => {
  return (
    <Controller
      name={meta.field}
      control={control}
      render={({ field }) => (
        <Checkbox {...field} disabled={Boolean(meta.readonly)} checked={Boolean(field.value)} />
      )}
    />
  );
};
