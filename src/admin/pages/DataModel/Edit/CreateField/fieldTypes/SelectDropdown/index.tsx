import { CloseCircleOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@collectionscms/plugin-ui';
import { logger } from '../../../../../../../utilities/logger.js';
import { shallowEqualObject } from '../../../../../../../utilities/shallowEqualObject.js';
import { ConfirmDiscardDialog } from '../../../../../../components/elements/ConfirmDiscardDialog/index.js';
import { Choice } from '../../../../../../config/types.js';
import {
  FormValues,
  createSelectDropdown as schema,
} from '../../../../../../fields/schemas/modelFields/selectDropdown/createSelectDropdown.js';
import { useUnsavedChangesPrompt } from '../../../../../../hooks/useUnsavedChangesPrompt.js';
import { Accordion } from '../../../Accordion/index.js';
import { useField } from '../../Context/index.js';
import { CreateChoice } from '../CreateChoice/index.js';
import { Props } from '../types.js';

export const SelectDropdownType: React.FC<Props> = (props) => {
  const { model, expanded, handleChange, onEditing, onSuccess, onChangeParentViewInvisible } =
    props;
  const [state, setState] = useState(false);
  const { t } = useTranslation();
  const { createField } = useField();
  const { trigger, isMutating } = createField();
  const defaultValues = { field: '', label: '', required: false, choices: [] };
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
      const values: Partial<{ choices: unknown[] }> = { ...defaultValues };
      delete values.choices;
      const isEqualed = shallowEqualObject(values, value);
      onEditing(!isEqualed || (value.choices || []).length > 0);
    });
  }, [watch]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'choices',
  });

  const onToggleCreateChoice = (state: boolean) => {
    setState(state);
    onChangeParentViewInvisible?.(state);
  };

  const onCreateChoiceSuccessfully = (choice: Choice) => {
    append(choice);
    onToggleCreateChoice(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      const field = await trigger({
        model: model.model,
        modelId: model.id,
        field: form.field,
        label: form.label,
        interface: 'selectDropdown',
        required: form.required,
        readonly: false,
        hidden: false,
        options: { choices: form.choices },
      });
      onSuccess(field!);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <CreateChoice
        openState={state}
        onSuccess={(choice) => onCreateChoiceSuccessfully(choice)}
        onClose={() => onToggleCreateChoice(false)}
      />
      <Accordion
        expanded={expanded}
        title={t('field_interface.select_dropdown')}
        description={t('field_interface.select_dropdown_caption')}
        icon={UnorderedListOutlined}
        type="middle"
        handleChange={() => handleChange('selectDropdown')}
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
          <Divider />
          <Typography>{t('choices')}</Typography>
          <Stack rowGap={1}>
            {fields.length > 0 ? (
              fields.map((field, index) => (
                <Stack direction="row" columnGap={1} key={field.id}>
                  <Box display="flex" alignItems="center">
                    <Typography>{field.label}</Typography>
                  </Box>
                  <IconButton color="secondary" onClick={() => remove(index)}>
                    <CloseCircleOutlined />
                  </IconButton>
                </Stack>
              ))
            ) : (
              <Typography variant="caption">{t('no_choice')}</Typography>
            )}
          </Stack>
          <Button
            variant="outlined"
            startIcon={<PlusOutlined style={{ fontSize: '10px' }} />}
            onClick={() => onToggleCreateChoice(true)}
          >
            {t('add_new_choice')}
          </Button>
          <Button variant="contained" type="submit" disabled={isMutating} fullWidth>
            {t('save')}
          </Button>
        </Stack>
      </Accordion>
    </>
  );
};
