import { yupResolver } from '@hookform/resolvers/yup';
import { AddOutlined, Cancel, FormatListBulletedOutlined } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import logger from '../../../../../../utilities/logger';
import { shallowEqualObject } from '../../../../../../utilities/shallowEqualObject';
import createFieldSchema, {
  FormValues,
} from '../../../../../fields/schemas/collectionFields/createField';
import { useField } from '../Context';
import CreateChoice from './CreateChoice';
import { Props } from './types';

const SelectDropdownType: React.FC<Props> = (props) => {
  const { slug, expanded, handleChange, onEditing, onSuccess, onChangeParentViewInvisible } = props;
  const [state, setState] = useState(false);
  const { t } = useTranslation();
  const { createField } = useField();
  const { trigger, isMutating } = createField(slug);
  const defaultValues = { field: '', label: '', required: false, options: { choices: [] } };
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(createFieldSchema(t)),
  });

  useEffect(() => {
    watch((value) => {
      const { ...values } = defaultValues;
      delete values.options;
      const isEqualed = shallowEqualObject(values, value);
      onEditing(!isEqualed || value.options.choices.length > 0);
    });
  }, [watch]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options.choices',
  });

  const onToggleCreateChoice = (state: boolean) => {
    setState(state);
    onChangeParentViewInvisible(state);
  };

  const onCreateChoiceSuccessfully = (choice: Choice) => {
    append(choice);
    onToggleCreateChoice(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      const field = await trigger({
        collection: slug,
        field: form.field,
        label: form.label,
        interface: 'selectDropdown',
        required: form.required,
        readonly: false,
        hidden: false,
        options: form.options,
      });
      reset();
      onSuccess(field);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <CreateChoice
        openState={state}
        onSuccess={(choice) => onCreateChoiceSuccessfully(choice)}
        onClose={() => onToggleCreateChoice(false)}
      />
      <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
        <Accordion
          expanded={expanded}
          square
          disableGutters
          onChange={() => handleChange('selectDropdown')}
        >
          <AccordionSummary aria-controls="panel-content" id="panel-header">
            <Stack direction="row" columnGap={2}>
              <Box display="flex" alignItems="center">
                <FormatListBulletedOutlined />
              </Box>
              <Stack direction="column">
                <Typography variant="subtitle1">{t('field_interface.select_dropdown')}</Typography>
                <Typography variant="caption">
                  {t('field_interface.select_dropdown_caption')}
                </Typography>
              </Stack>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ py: 3 }}>
            <Stack rowGap={3}>
              <Grid container spacing={3} columns={{ xs: 1, sm: 4 }}>
                <Grid xs={1} sm={2}>
                  <InputLabel required>{t('field')}</InputLabel>
                  <Controller
                    name="field"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        fullWidth
                        placeholder={`${t('input-placeholder')} name`}
                        error={errors.field !== undefined}
                      />
                    )}
                  />
                  <FormHelperText error>{errors.field?.message}</FormHelperText>
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
                        control={<Checkbox />}
                      />
                    )}
                  />
                  <FormHelperText error>{errors.required?.message}</FormHelperText>
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
              <Button
                variant="contained"
                type="submit"
                size="large"
                disabled={isMutating}
                fullWidth
              >
                {t('save')}
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </>
  );
};

export default SelectDropdownType;
