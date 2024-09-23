import { FormHelperText, InputLabel, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { t } from 'i18next';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

type Props = {
  control: Control<any, any>;
  errors: FieldErrors<{ url?: string | null }>;
};

export const CustomForm: React.FC<Props> = (props) => {
  return (
    <Grid xs={12}>
      <Stack spacing={1}>
        <InputLabel required>{t(`providers_field.url`)}</InputLabel>
        <Controller
          name="url"
          control={props.control}
          render={({ field }) => (
            <TextField
              {...field}
              type="text"
              fullWidth
              placeholder="https://..."
              error={props.errors.url !== undefined}
            />
          )}
        />
        <FormHelperText error>{props.errors.url?.message}</FormHelperText>
      </Stack>
    </Grid>
  );
};
