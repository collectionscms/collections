import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import logger from '../../../../../../../utilities/logger';
import { shallowEqualObject } from '../../../../../../../utilities/shallowEqualObject';
import {
  FormValues,
  updateBoolean as schema,
} from '../../../../../../fields/schemas/collectionFields/boolean/updateBoolean';
import { useField } from '../../Context';
import { Props } from '../types';

export const BooleanType: React.FC<Props> = (props) => {
  const { field: meta, onEditing, onSuccess } = props;
  const { t } = useTranslation();
  const { updateField } = useField();
  const { trigger, isMutating } = updateField(meta.id);
  const defaultValues = {
    label: meta.label,
    defaultValue: meta.fieldOption.defaultValue,
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    watch((value) => {
      const isEqualed = shallowEqualObject(defaultValues, value);
      onEditing(!isEqualed);
    });
  }, [watch]);

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      const formData = {
        label: form.label,
        options: JSON.stringify({ defaultValue: form.defaultValue }),
      };
      await trigger(formData);
      reset();
      onSuccess({
        ...meta,
        ...formData,
      });
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
        <Stack rowGap={3}>
          <Grid container spacing={3} columns={{ xs: 1, sm: 4 }}>
            <Grid xs={1} sm={2}>
              <InputLabel required>{t('field')}</InputLabel>
              <TextField type="text" fullWidth disabled defaultValue={meta.field} />
            </Grid>
            <Grid xs={1} sm={2}>
              <InputLabel required>{t('label')}</InputLabel>
              <Controller
                name="label"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="text"
                    fullWidth
                    placeholder={`${t('input-placeholder')} ${t('name')}`}
                    error={errors.label !== undefined}
                  />
                )}
              />
              <FormHelperText error>{errors.label?.message}</FormHelperText>
            </Grid>
            <Grid xs={1} sm={2}>
              <InputLabel htmlFor="field">{t('default_value')}</InputLabel>
              <Controller
                name="defaultValue"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    label={t('enabled')}
                    control={<Checkbox checked={field.value} />}
                  />
                )}
              />
              <FormHelperText error>{errors.defaultValue?.message}</FormHelperText>
            </Grid>
          </Grid>
          <Button variant="contained" type="submit" size="large" disabled={isMutating} fullWidth>
            {t('save')}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
