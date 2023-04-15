import { yupResolver } from '@hookform/resolvers/yup';
import { AddOutlined, Cancel } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Choice } from 'shared/types';
import logger from '../../../../../../../utilities/logger';
import { shallowEqualObject } from '../../../../../../../utilities/shallowEqualObject';
import {
  FormValues,
  updateSelectDropdown as schema,
} from '../../../../../../fields/schemas/collectionFields/selectDropdown/updateSelectDropdown';
import { CreateChoice } from '../../../CreateField/fieldTypes/CreateChoice';
import { useField } from '../../Context';
import { Props } from '../types';

export const SelectDropdownType: React.FC<Props> = (props) => {
  const { field: meta, onEditing, onSuccess, onChangeParentViewInvisible } = props;
  const [state, setState] = useState(false);
  const { t } = useTranslation();
  const { updateField } = useField();
  const { trigger, isMutating } = updateField(meta.id);
  const defaultValues = {
    label: meta.label,
    required: Boolean(meta.required),
    readonly: Boolean(meta.readonly),
    hidden: Boolean(meta.hidden),
    choices: meta.fieldOption.choices,
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'choices',
  });

  useEffect(() => {
    watch((value) => {
      const { ...values } = defaultValues;
      delete values.choices;
      const isEqualed = shallowEqualObject(values, value);
      onEditing(!isEqualed || value.choices.length !== defaultValues.choices.length);
    });
  }, [watch]);

  const onToggleCreateChoice = (state: boolean) => {
    setState(state);
    onChangeParentViewInvisible(state);
  };

  const handleCreateChoiceSuccess = (choice: Choice) => {
    append(choice);
    onToggleCreateChoice(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      const formData = {
        label: form.label,
        required: form.required,
        readonly: form.readonly,
        hidden: form.hidden,
        options: JSON.stringify({ choices: form.choices }),
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
      <CreateChoice
        openState={state}
        onSuccess={(choice) => handleCreateChoiceSuccess(choice)}
        onClose={() => onToggleCreateChoice(false)}
      />
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
              <InputLabel htmlFor="field">{t('required_fields')}</InputLabel>
              <Controller
                name="required"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    label={t('required_at_creation')}
                    control={<Checkbox checked={field.value} />}
                  />
                )}
              />
              <FormHelperText error>{errors.required?.message}</FormHelperText>
            </Grid>
            <Grid xs={1} sm={2}>
              <InputLabel htmlFor="field">{t('readonly')}</InputLabel>
              <Controller
                name="readonly"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    label={t('disable_editing_value')}
                    control={<Checkbox checked={field.value} />}
                  />
                )}
              />
              <FormHelperText error>{errors.readonly?.message}</FormHelperText>
            </Grid>
            <Grid xs={1} sm={2}>
              <InputLabel htmlFor="field">{t('hidden')}</InputLabel>
              <Controller
                name="hidden"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    label={t('hidden_on_detail')}
                    control={<Checkbox checked={field.value} />}
                  />
                )}
              />
              <FormHelperText error>{errors.hidden?.message}</FormHelperText>
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
                  <IconButton onClick={() => remove(index)}>
                    <Cancel />
                  </IconButton>
                </Stack>
              ))
            ) : (
              <Typography variant="caption">{t('no_choice')}</Typography>
            )}
          </Stack>
          <Button
            variant="outlined"
            startIcon={<AddOutlined />}
            onClick={() => onToggleCreateChoice(true)}
          >
            {t('add_new_choice')}
          </Button>
          <Button variant="contained" type="submit" size="large" disabled={isMutating} fullWidth>
            {t('save')}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
