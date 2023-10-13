import { SubnodeOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
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
  createListOneToMany as schema,
} from '../../../../../../fields/schemas/modelFields/listOneToMany/createListOneToMany.js';
import { Accordion } from '../../../Accordion/index.js';
import { useField } from '../../Context/index.js';
import { Props } from '../types.js';
import { useUnsavedChangesPrompt } from '../../../../../../hooks/useUnsavedChangesPrompt.js';
import { ConfirmDiscardDialog } from '../../../../../../components/elements/ConfirmDiscardDialog/index.js';

export const ListOneToManyType: React.FC<Props> = (props) => {
  const { model, expanded, handleChange, onEditing, onSuccess } = props;
  const { t } = useTranslation();
  const { getModels, createRelationalFields } = useField();
  const { data: models } = getModels();
  const { trigger: createRelationalFieldsTrigger, isMutating } = createRelationalFields();
  const defaultValues = {
    field: '',
    label: '',
    required: false,
    relatedModel: '',
    foreignKey: '',
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
      const relatedModel = models.find((model) => model.model === form.relatedModel);
      const results = await createRelationalFieldsTrigger({
        fields: [
          {
            model: model.model,
            modelId: model.id,
            field: form.field,
            label: form.label,
            interface: 'listOneToMany',
            required: form.required,
            readonly: false,
            hidden: false,
          },
          {
            model: form.relatedModel,
            modelId: relatedModel?.id,
            field: form.foreignKey,
            label: model.model,
            interface: 'selectDropdownManyToOne',
            required: false,
            readonly: false,
            hidden: true,
          },
        ],
        relation: {
          manyModel: form.relatedModel,
          manyModelId: relatedModel?.id.toString(),
          manyField: form.foreignKey,
          oneModel: model.model,
          oneModelId: model.id,
          oneField: form.field,
        },
      });
      onSuccess(results![0]);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <Accordion
        expanded={expanded}
        title={t('field_interface.list_o2m')}
        description={t('field_interface.list_o2m_caption')}
        icon={SubnodeOutlined}
        type="bottom"
        handleChange={() => handleChange('listOneToMany')}
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
                <InputLabel required>{t('related_content')}</InputLabel>
                <Controller
                  name="relatedModel"
                  control={control}
                  defaultValue={''}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      defaultValue={''}
                      error={errors.relatedModel !== undefined}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {models &&
                        models
                          .filter((meta) => meta.model !== model.model)
                          .map((model) => (
                            <MenuItem value={model.model} key={model.model}>
                              {model.model}
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                />
                <FormHelperText error>{errors.relatedModel?.message}</FormHelperText>
              </Stack>
            </Grid>
            <Grid xs={1} sm={2}>
              <Stack spacing={1}>
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
