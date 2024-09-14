import { FormHelperText, InputLabel, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { t } from 'i18next';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { FormValues } from '../../../../fields/validators/webhookSettings/values';

type Props = {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
};

export const VercelForm: React.FC<Props> = (props) => {
  return (
    <>
      <Grid xs={12}>
        <Stack spacing={1}>
          <InputLabel required>{t(`providers_field.url`)}</InputLabel>
          <Typography variant="caption" color="text.secondary">
            {t(`providers_field.vercel_url_caption`)}
          </Typography>
          <Controller
            name="url"
            control={props.control}
            render={({ field }) => (
              <TextField {...field} type="text" fullWidth error={props.errors.url !== undefined} />
            )}
          />
          <FormHelperText error>{props.errors.url?.message}</FormHelperText>
        </Stack>
      </Grid>
    </>
  );
};
