import { PlusOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
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
import { logger } from '../../../../../../../utilities/logger.js';
import { shallowEqualObject } from '../../../../../../../utilities/shallowEqualObject.js';
import { ConfirmDiscardDialog } from '../../../../../../components/elements/ConfirmDiscardDialog/index.js';
import { Choice } from '../../../../../../config/types.js';
import {
  FormValues,
  updateSelectDropdown as schema,
} from '../../../../../../fields/schemas/modelFields/selectDropdown/updateSelectDropdown.js';
import { useUnsavedChangesPrompt } from '../../../../../../hooks/useUnsavedChangesPrompt.js';
import { ChoiceField } from '../../../ChoiceField/index.js';
import { useField } from '../../Context/index.js';
import { Props } from '../types.js';
import { DropdownChoice } from './DropdownChoice/index.js';

export const SelectDropdownType: React.FC<Props> = (props) => {
  const { field: meta, onEditing, onSuccess, onChangeParentViewInvisible } = props;
  const [state, setState] = useState(false);
  const [choiceValue, setChoiceValue] = useState<{ id: string; label: string; value: string }>();
  const { t } = useTranslation();
  const { updateField } = useField();
  const { trigger, isMutating } = updateField(meta.id);
  const defaultValues = {
    label: meta.label,
    required: Boolean(meta.required),
    readonly: Boolean(meta.readonly),
    hidden: Boolean(meta.hidden),
    choices: meta.fieldOption?.choices,
  };
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'choices',
  });

  useEffect(() => {
    watch((value) => {
      const values: Partial<{ choices: unknown[] }> = { ...defaultValues };
      delete values.choices;
      const isEqualed = shallowEqualObject(values, value);
      const selectedChoices = value.choices || [];
      const defaultChoices = defaultValues.choices || [];
      onEditing(!isEqualed || selectedChoices.length !== defaultChoices.length);
    });
  }, [watch]);

  const toggleChoiceField = (state: boolean) => {
    setState(state);
    onChangeParentViewInvisible?.(state);
  };

  // /////////////////////////////////////
  // Operation to drawer
  // /////////////////////////////////////

  const onToggleCreateChoice = () => {
    setChoiceValue({ id: '', label: '', value: '' });
    toggleChoiceField(true);
  };

  const onToggleUpdateChoice = (field: { id: string; label: string; value: string }) => {
    setChoiceValue(field);
    toggleChoiceField(true);
  };

  // /////////////////////////////////////
  // Operation to choices
  // /////////////////////////////////////

  const handleDeleteChoice = (id: string) => {
    const index = fields.findIndex((field) => field.id === id);
    remove(index);
  };

  const handleSaveChoice = (id: string | null, choice: Choice) => {
    if (id) {
      const index = fields.findIndex((field) => field.id === id);
      update(index, choice);
    } else {
      append(choice);
    }

    toggleChoiceField(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      const formData = {
        label: form.label,
        required: form.required,
        readonly: form.readonly,
        hidden: form.hidden,
        options: JSON.stringify({ choices: form.choices }),
      };
      await trigger(formData);
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
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <ChoiceField
        openState={state}
        values={choiceValue}
        onSave={(id, choice) => handleSaveChoice(id, choice)}
        onClose={() => toggleChoiceField(false)}
      />
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
        <Grid container spacing={3} columns={{ xs: 1, sm: 4 }}>
          <Grid xs={1} sm={2}>
            <Stack spacing={1}>
              <InputLabel required>{t('field_name')}</InputLabel>
              <TextField type="text" fullWidth disabled defaultValue={meta.field} />
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
                    control={<Checkbox checked={field.value} />}
                  />
                )}
              />
              <FormHelperText error>{errors.required?.message}</FormHelperText>
            </Stack>
          </Grid>
          <Grid xs={1} sm={2}>
            <Stack spacing={1}>
              <InputLabel>{t('readonly')}</InputLabel>
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
            </Stack>
          </Grid>
          <Grid xs={1} sm={2}>
            <Stack spacing={1}>
              <InputLabel>{t('status')}</InputLabel>
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
            </Stack>
          </Grid>
        </Grid>
        <Divider />
        <Typography>{t('choices')}</Typography>
        <Stack rowGap={1}>
          {fields.length > 0 ? (
            fields.map((field) => (
              <DropdownChoice
                key={field.id}
                field={{
                  id: field.id,
                  label: field.label,
                  value: field.value,
                }}
                onEdit={(field) => onToggleUpdateChoice(field)}
                onDelete={(id) => handleDeleteChoice(id)}
              />
            ))
          ) : (
            <Typography variant="caption">{t('no_choice')}</Typography>
          )}
        </Stack>
        <Button
          variant="outlined"
          startIcon={<PlusOutlined style={{ fontSize: '10px' }} />}
          onClick={onToggleCreateChoice}
        >
          {t('add_new_choice')}
        </Button>
        <Button variant="contained" type="submit" disabled={isMutating} fullWidth>
          {t('save')}
        </Button>
      </Stack>
    </>
  );
};
