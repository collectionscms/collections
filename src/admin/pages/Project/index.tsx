import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, InputLabel, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../utilities/logger.js';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { ConfirmDiscardDialog } from '../../components/elements/ConfirmDiscardDialog/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updateProject as updateProjectSchema,
} from '../../fields/validators/projects/updateProject.js';
import { useUnsavedChangesPrompt } from '../../hooks/useUnsavedChangesPrompt.js';
import { ProjectContextProvider, useProject } from './Context/index.js';
import { LocaleSelection } from './LocaleSelection/index.js';

const ProjectImpl: React.FC = () => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [showSelection, setShowSelection] = React.useState(false);

  const { getProject, updateProject } = useProject();
  const { data: project, mutate } = getProject();
  const { trigger, isMutating } = updateProject();
  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: project.name,
    },
    resolver: yupResolver(updateProjectSchema()),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await trigger(form);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
    } catch (e) {
      logger.error(e);
    }
  };

  const handleUpdateLocale = async () => {
    await mutate();
    setShowSelection(false);
    enqueueSnackbar(t('toast.updated_default_locale'), { variant: 'success' });
  };

  return (
    <>
      <LocaleSelection
        currentLocale={project.defaultLocale}
        open={showSelection}
        onClose={() => setShowSelection(false)}
        onAdded={() => handleUpdateLocale()}
      />
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <Grid container spacing={2.5}>
        <Grid xs={12} lg={8}>
          <MainCard>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
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
                          placeholder={`${t('input_placeholder')} Collections`}
                          error={errors.name !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.name?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="projectName">{t('default_language')}</InputLabel>
                    <Stack spacing={1.5} direction="row" alignItems="center">
                      <Typography>
                        {t(`locale.${project.defaultLocale}` as unknown as TemplateStringsArray)}
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        color="inherit"
                        sx={{ textDecoration: 'underline' }}
                        onClick={() => setShowSelection(true)}
                      >
                        {t('edit_locale')}
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
                {hasPermission('updateProject') && (
                  <Grid xs={12}>
                    <Stack direction="row" justifyContent="flex-end">
                      <Button variant="contained" type="submit" disabled={isMutating}>
                        {t('update')}
                      </Button>
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </form>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export const Project = ComposeWrapper({ context: ProjectContextProvider })(ProjectImpl);
