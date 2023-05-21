import { yupResolver } from '@hookform/resolvers/yup';
import { NotesOutlined } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
  Typography,
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
} from '../../../../../../fields/schemas/collectionFields/input/createInput.js';
import { useField } from '../../Context/index.js';
import { Props } from '../types.js';

export const InputMultilineType: React.FC<Props> = (props) => {
  const { collection, expanded, handleChange, onEditing, onSuccess } = props;
  const { t } = useTranslation();
  const { createField } = useField();
  const { trigger, isMutating } = createField(collection);
  const defaultValues = { field: '', label: '', required: false };
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema(t)),
  });

  useEffect(() => {
    watch((value) => {
      const isEqualed = shallowEqualObject(defaultValues, value);
      onEditing(!isEqualed);
    });
  }, [watch]);

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      const field = await trigger({
        collection: collection,
        field: form.field,
        label: form.label,
        interface: 'inputMultiline',
        required: form.required,
        readonly: false,
        hidden: false,
      });
      reset();
      onSuccess(field!);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
      <Accordion
        expanded={expanded}
        square
        disableGutters
        onChange={() => handleChange('inputMultiline')}
      >
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
          <Stack direction="row" columnGap={2}>
            <Box display="flex" alignItems="center">
              <NotesOutlined />
            </Box>
            <Stack direction="column">
              <Typography variant="subtitle1">{t('field_interface.input_multi_line')}</Typography>
              <Typography variant="caption">
                {t('field_interface.input_multi_line_caption')}
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
            <Button variant="contained" type="submit" size="large" disabled={isMutating} fullWidth>
              {t('save')}
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};
