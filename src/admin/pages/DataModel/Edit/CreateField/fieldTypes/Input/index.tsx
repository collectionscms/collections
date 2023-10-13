import { EditOutlined } from '@ant-design/icons';
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
  createInput as schema,
} from '../../../../../../fields/schemas/modelFields/input/createInput.js';
import { Accordion } from '../../../Accordion/index.js';
import { useField } from '../../Context/index.js';
import { Props } from '../types.js';
import { useUnsavedChangesPrompt } from '../../../../../../hooks/useUnsavedChangesPrompt.js';
import { ConfirmDiscardDialog } from '../../../../../../components/elements/ConfirmDiscardDialog/index.js';

export const InputType: React.FC<Props> = (props) => {
  const { model, expanded, handleChange, onEditing, onSuccess } = props;
  const { t } = useTranslation();
  const { createField } = useField();
  const { trigger, isMutating } = createField();
  const defaultValues = { field: '', label: '', required: false };
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
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

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
        model: model.model,
        modelId: model.id,
        field: form.field,
        label: form.label,
        interface: 'input',
        required: form.required,
        readonly: false,
        hidden: false,
      });
      onSuccess(field!);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <Accordion
        expanded={expanded}
        title={t('field_interface.input_one_line')}
        description={t('field_interface.input_one_line_caption')}
        icon={EditOutlined}
        type="top"
        handleChange={() => handleChange('input')}
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
