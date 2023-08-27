import { Checkbox } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Props } from '../types.js';

export const BooleanType: React.FC<Props> = ({ form: { control }, field: meta }) => {
  return (
    <Controller
      name={meta.field}
      control={control}
      render={({ field }) => (
        <Grid container alignItems="left" justifyContent="left" direction="row">
          <Checkbox {...field} disabled={Boolean(meta.readonly)} checked={Boolean(field.value)} />
        </Grid>
      )}
    />
  );
};
