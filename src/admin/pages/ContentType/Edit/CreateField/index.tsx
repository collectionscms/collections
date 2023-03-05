import { yupResolver } from '@hookform/resolvers/yup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FieldInterface } from '../../../../../shared/types';
import ComposeWrapper from '../../../../components/utilities/ComposeWrapper';
import createFieldSchema, {
  FormValues,
} from '../../../../fields/schemas/collectionFields/createField';
import {
  FieldContextProvider,
  useField,
} from '../../../../pages/ContentType/Edit/CreateField/Context';
import { Props } from './types';

const CreateField: React.FC<Props> = ({ slug, openState, onSuccess, onClose }) => {
  const [fieldInterface, setFieldInterface] = useState<FieldInterface>(null);
  const theme = useTheme();
  const { t } = useTranslation();
  const { createField } = useField();
  const { data, trigger, isMutating } = createField(slug);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { field: '', label: '', required: false },
    resolver: yupResolver(createFieldSchema(t)),
  });

  const onToggle = () => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    onClose();
  };

  const onSelectedFieldInterface = (fieldInterface: FieldInterface) => {
    setFieldInterface(fieldInterface);
  };

  const onSubmit: SubmitHandler<FormValues> = (form: FormValues) => {
    trigger({
      collection: slug,
      field: form.field,
      label: form.label,
      interface: fieldInterface,
      required: form.required,
      readonly: false,
      hidden: false,
    });
  };

  const resetForm = () => {
    reset();
    setFieldInterface(null);
  };

  useEffect(() => {
    if (data === undefined) return;
    onSuccess(data);
    resetForm();
  }, [data]);

  return (
    <Box>
      <Drawer
        anchor="right"
        open={openState}
        onClose={onToggle()}
        sx={{ zIndex: theme.zIndex.appBar + 200 }}
      >
        <Box role="presentation">
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{t('field_type')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                spacing={3}
                columns={{ xs: 1, sm: 4, md: 8 }}
                sx={{ width: { xs: 400, sm: 600, md: 800 } }}
              >
                <Grid xs={1} sm={2} md={2}>
                  <Button
                    variant={fieldInterface === 'input' ? 'contained' : 'outlined'}
                    onClick={() => onSelectedFieldInterface('input')}
                    fullWidth
                  >
                    {t('text_field')}
                  </Button>
                </Grid>
                <Grid xs={1} sm={2} md={2}>
                  <Button
                    variant={fieldInterface === 'inputMultiline' ? 'contained' : 'outlined'}
                    onClick={() => onSelectedFieldInterface('inputMultiline')}
                    fullWidth
                  >
                    {t('textarea')}
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion disabled={fieldInterface === null} expanded={fieldInterface !== null}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>{t('field_property')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
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
                <Button variant="contained" type="submit" disabled={isMutating} fullWidth>
                  {t('save')}
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ComposeWrapper({ context: FieldContextProvider })(CreateField);
