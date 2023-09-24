import { CheckSquareOutlined } from '@ant-design/icons';
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
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../../../../utilities/logger.js';
import { shallowEqualObject } from '../../../../../../../utilities/shallowEqualObject.js';
import {
  FormValues,
  createBoolean as schema,
} from '../../../../../../fields/schemas/collectionFields/boolean/createBoolean.js';
import { Accordion } from '../../../Accordion/index.js';
import { useField } from '../../Context/index.js';
import { Props } from '../types.js';
import { useUnsavedPrompt } from '../../../../../../hooks/useUnsavedPrompt.js';
import { ConfirmDiscardDialog } from '../../../../../../components/elements/ConfirmDiscardDialog/index.js';

export const BooleanType: React.FC<Props> = (props) => {
  const { collection, expanded, handleChange, onEditing, onSuccess } = props;
  const { t } = useTranslation();
  const { createField } = useField();
  const { trigger, isMutating } = createField();
  const defaultValues = {
    field: '',
    label: '',
    required: false,
    default_value: false,
  };
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema(t)),
  });
  const { showPrompt, discard, keep } = useUnsavedPrompt(isDirty);

  useEffect(() => {
    watch((value) => {
      const isEqualed = shallowEqualObject(defaultValues, value);
      onEditing(!isEqualed);
    });
  }, [watch]);

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      const field = await trigger({
        collection: collection.collection,
        collection_id: collection.id,
        field: form.field,
        label: form.label,
        interface: 'boolean',
        required: form.required,
        readonly: false,
        hidden: false,
        options: { defaultValue: form.default_value },
      });
      onSuccess(field!);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={discard} onKeepEditing={keep} />
      <Accordion
        expanded={expanded}
        title={t('field_interface.boolean')}
        description={t('field_interface.boolean_caption')}
        icon={CheckSquareOutlined}
        type="middle"
        handleChange={() => handleChange('boolean')}
      >
        <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
          <Grid container spacing={3} columns={{ xs: 1, sm: 4 }}>
            <Grid xs={1} sm={2}>
              <Stack spacing={1}>
                <InputLabel required>{t('field_name')}</InputLabel>
                <Controller
                  name="field"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      fullWidth
                      placeholder={`${t('input_placeholder')} name`}
                      error={errors.field !== undefined}
                    />
                  )}
                />
                <FormHelperText error>{errors.field?.message}</FormHelperText>
              </Stack>
            </Grid>
            <Grid xs={1} sm={2}>
              <Stack spacing={1}>
                <InputLabel required>{t('label')}</InputLabel>
                <Controller
                  name="label"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      fullWidth
                      placeholder={`${t('input_placeholder')} ${t('name')}`}
                      error={errors.label !== undefined}
                    />
                  )}
                />
                <FormHelperText error>{errors.label?.message}</FormHelperText>
              </Stack>
            </Grid>
            <Grid xs={1} sm={2}>
              <Stack spacing={1}>
                <InputLabel>{t('default_value')}</InputLabel>
                <Controller
                  name="default_value"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel {...field} label={t('enabled')} control={<Checkbox />} />
                  )}
                />
                <FormHelperText error>{errors.default_value?.message}</FormHelperText>
              </Stack>
            </Grid>
            <Grid xs={1} sm={2}>
              <Stack spacing={1}>
                <InputLabel>{t('required_fields')}</InputLabel>
                <Controller
                  name="required"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      {...field}
                      label={t('required_at_creation')}
                      control={<Checkbox />}
                    />
                  )}
                />
                <FormHelperText error>{errors.required?.message}</FormHelperText>
              </Stack>
            </Grid>
          </Grid>
          <Button variant="contained" type="submit" disabled={isMutating} fullWidth>
            {t('save')}
          </Button>
        </Stack>
      </Accordion>
    </>
  );
};
