import { Button, FormHelperText, InputLabel, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { t } from 'i18next';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  FormValues,
  projectSettings as projectSettingsValidator,
} from '../../../fields/validators/projects/projectSettings.js';

import { yupResolver } from '@hookform/resolvers/yup';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { useTranslation } from 'react-i18next';
import { useProject } from '../Context/index.js';
import { logger } from '../../../../utilities/logger.js';

export type ProjectData = { name: string; subdomain: string };
type Props = {
  projectData: ProjectData;
  setProjectData: (p: ProjectData) => void;
  handleNext: () => void;
};

export const ProjectSettingsForm: React.FC<Props> = ({
  projectData,
  setProjectData,
  handleNext,
}) => {
  const { t } = useTranslation();
  const { checkSubdomainAvailability } = useProject();
  const { trigger } = checkSubdomainAvailability();

  const {
    control,
    handleSubmit,
    setError,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: projectData.name,
      subdomain: projectData.subdomain,
    },
    resolver: yupResolver(projectSettingsValidator()),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      const result = await trigger({ subdomain: form.subdomain });
      if (result.available) {
        setProjectData(form);
        handleNext();
      } else {
        setError('subdomain', {
          type: 'manual',
          message: t('error.already_registered_project_id'),
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        {t('project_setting')}
      </Typography>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="projectName">{t('project_name')}</InputLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="projectName"
                    type="text"
                    fullWidth
                    placeholder={`${t('input_placeholder')} My Project`}
                    error={errors.name !== undefined}
                  />
                )}
              />
              <FormHelperText error>{errors.name?.message}</FormHelperText>
            </Stack>
          </Grid>
          <Grid xs={12} sm={6}>
            <Stack spacing={1}>
              <InputLabel htmlFor="projectName">{t('project_id')}</InputLabel>
              <Controller
                name="subdomain"
                control={control}
                render={({ field }) => (
                  <Stack direction="row" alignItems="center" gap={1}>
                    <TextField
                      {...field}
                      id="projectName"
                      type="text"
                      fullWidth
                      placeholder={`${t('input_placeholder')} my-project`}
                      error={errors.subdomain !== undefined}
                    />
                    <Typography>.collections.dev</Typography>
                  </Stack>
                )}
              />
              <FormHelperText error>{errors.subdomain?.message}</FormHelperText>
            </Stack>
          </Grid>
          <Grid xs={12}>
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" type="submit">
                {t('next')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};
