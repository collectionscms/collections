import { yupResolver } from '@hookform/resolvers/yup';
import { SettingsEthernetOutlined } from '@mui/icons-material';
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
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../../../../utilities/logger.js';
import { shallowEqualObject } from '../../../../../../../utilities/shallowEqualObject.js';
import {
  FormValues,
  createListOneToMany as schema,
} from '../../../../../../fields/schemas/collectionFields/listOneToMany/createListOneToMany.js';
import { useField } from '../../Context/index.js';
import { Props } from '../types.js';
import { Field } from '../../../../../../../config/types.js';

export const ListOneToManyType: React.FC<Props> = (props) => {
  const { slug, expanded, handleChange, onEditing, onSuccess } = props;
  const { t } = useTranslation();
  const { createField, getCollections, createRelations } = useField();
  const { data: collections } = getCollections();
  const { trigger: createFieldTrigger, isMutating } = createField();
  const { trigger: createRelationsTrigger } = createRelations();
  const defaultValues = {
    field: '',
    label: '',
    required: false,
    relatedCollection: '',
    foreignKey: '',
  };
  const {
    control,
    handleSubmit,
    reset,
    watch,
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
      const results = await Promise.all([
        createFieldTrigger({
          collection: slug,
          field: form.field,
          label: form.label,
          interface: 'listOneToMany',
          required: form.required,
          readonly: false,
          hidden: false,
        }),
        createFieldTrigger({
          collection: form.relatedCollection,
          field: form.foreignKey,
          label: slug,
          interface: 'selectDropdownManyToOne',
          required: form.required,
          readonly: false,
          hidden: false,
        }),
      ]);

      await createRelationsTrigger({
        manyCollection: form.relatedCollection,
        manyField: form.foreignKey,
        oneCollection: slug,
        oneField: form.field,
      });
      reset();
      onSuccess(results[0] as Field);
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
        onChange={() => handleChange('listOneToMany')}
      >
        <AccordionSummary aria-controls="panel-content" id="panel-header">
          <Stack direction="row" columnGap={2}>
            <Box display="flex" alignItems="center">
              <SettingsEthernetOutlined />
            </Box>
            <Stack direction="column">
              <Typography variant="subtitle1">{t('field_interface.list_o2m')}</Typography>
              <Typography variant="caption">{t('field_interface.list_o2m_caption')}</Typography>
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
                <InputLabel required>{t('related_content')}</InputLabel>
                <Controller
                  name="relatedCollection"
                  control={control}
                  defaultValue={''}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      defaultValue={''}
                      error={errors.relatedCollection !== undefined}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {collections &&
                        collections
                          .filter((collection) => collection.collection !== slug)
                          .map((collection) => (
                            <MenuItem value={collection.collection} key={collection.collection}>
                              {collection.collection}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                />
                <FormHelperText error>{errors.relatedCollection?.message}</FormHelperText>
              </Grid>
              <Grid xs={1} sm={2}>
                <InputLabel required>{t('foreign_key')}</InputLabel>
                <Controller
                  name="foreignKey"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      fullWidth
                      error={errors.foreignKey !== undefined}
                    />
                  )}
                />
                <FormHelperText error>{errors.foreignKey?.message}</FormHelperText>
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
